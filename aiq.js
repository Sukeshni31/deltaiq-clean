export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { company, industry } = req.body;

  if (!company || !industry) {
    return res.status(400).json({ error: "Missing company or industry" });
  }

  // --- Industry medians ---
  const industryMedian = {
    "IT Services": 55,
    "Aviation": 50,
    "Manufacturing": 48,
    "Pharma / Healthcare": 60,
    "SaaS / Product": 65,
    "GCC / Captive": 58
  };

  // --- Peer benchmarks ---
  const peerBenchmarks = {
    "IT Services": {
      "TCS": 68,
      "Infosys": 64,
      "Accenture": 70,
      "Cognizant": 60
    },
    "Aviation": {
      "Lufthansa": 58,
      "Emirates": 62,
      "Delta Airlines": 55,
      "Air France": 53
    }
  };

  // --- Simple deterministic AIQ ---
  const base = industryMedian[industry] || 50;
  const variance = company.length % 7; // stable pseudo logic
  const aiq = Math.max(35, Math.min(75, base - 5 + variance));

  // --- Peer comparison ---
  const peers = peerBenchmarks[industry] || {};
  const peerScores = Object.entries(peers).map(([name, score]) => ({
    name,
    score
  }));

  peerScores.push({ name: company, score: aiq });

  peerScores.sort((a, b) => b.score - a.score);

  const rank = peerScores.findIndex(p => p.name === company) + 1;

  res.status(200).json({
    company,
    industry,
    aiq,
    industryMedian: base,
    position: `Top ${Math.round((rank / peerScores.length) * 100)}%`,
    peerComparison: {
      rank,
      total: peerScores.length,
      peers: peerScores
    }
  });
}
