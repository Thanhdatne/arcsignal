export const markets = [
  {
    id: "fed-rate-june-2026",
    title: "Fed Rate Decision — June 2026",
    description:
      "Forecast the Federal Reserve interest rate decision for the June 2026 meeting.",
    category: "Macro",
    volume: "$1.2M",
    liquidity: "$420K",
    settlement: "USDC on Arc",
    resolution: "Official Federal Reserve statement release.",
    outcomes: [
      { label: "0.10%", probability: 8 },
      { label: "0.25%", probability: 54 },
      { label: "0.50%", probability: 31 },
      { label: "1.00%", probability: 7 },
    ],
  },
  {
    id: "us-cpi-july-2026",
    title: "US CPI YoY — July 2026",
    description:
      "Forecast the year-over-year US CPI range for the July 2026 release.",
    category: "Inflation",
    volume: "$842K",
    liquidity: "$265K",
    settlement: "USDC on Arc",
    resolution: "Official Bureau of Labor Statistics CPI release.",
    outcomes: [
      { label: "<2.5%", probability: 12 },
      { label: "2.5–3.0%", probability: 48 },
      { label: "3.0–3.5%", probability: 29 },
      { label: ">3.5%", probability: 11 },
    ],
  },
]