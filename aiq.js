export const industryBenchmarks = {
  "IT Services": 55,
  "SaaS / Product": 62,
  "Aviation": 45,
  "Manufacturing": 42,
  "Pharma / Healthcare": 48,
  "GCC / Captive": 50
};

export function calculateAIQ(company, industry) {
  const base = industryBenchmarks[industry] || 50;

  // deterministic variance (stable demo behavior)
  const variance = company.length % 7 - 3;

  const aiq = Math.max(30, Math.min(80, base + variance));

  return {
    aiq,
    industryMedian: base,
    const delta = aiq - base;
const percentile = Math.max(
  10,
  Math.min(90, Math.round(50 + delta * 4))
);
    radar: [
      aiq - 5,
      aiq + 2,
      aiq,
      aiq - 3,
      aiq + 1,
      aiq - 1
    ]
  };
}
