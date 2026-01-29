export default function handler(req, res) {
  const q = (req.query.q || "").toLowerCase();

  const companies = [
    "Lufthansa",
    "Airbus",
    "Boeing",
    "Apple",
    "Google",
    "Microsoft",
    "Amazon",
    "TCS",
    "Infosys",
    "Accenture",
    "Deloitte",
    "Pfizer",
    "Novartis"
  ];

  const matches = companies.filter(c =>
    c.toLowerCase().includes(q)
  );

  res.status(200).json(matches);
}
