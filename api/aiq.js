export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { company, industry, peers = [] } = req.body;
  if (!company || !industry) return res.status(400).json({ error: "Missing company or industry" });

  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY missing" });

  const prompt = [
    {
      role: "system",
      content: "You are DeltaAIQ. Return ONLY valid JSON. No markdown."
    },
    {
      role: "user",
      content: JSON.stringify({
        task: "company_benchmark",
        company,
        industry,
        peers
      })
    }
  ];

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 500
      })
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: "OpenAI error", details: t });
    }

    const payload = await r.json();
    const text = payload?.output?.[0]?.content
      ?.map(c => (c.type === "output_text" ? c.text : ""))
      .join("") || "";

    const data = JSON.parse(text);
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
