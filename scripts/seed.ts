import { prisma } from "../lib/prisma"

async function main() {
  await prisma.trade.deleteMany()
  await prisma.outcome.deleteMany()
  await prisma.market.deleteMany()

  await prisma.market.create({
    data: {
      onchainMarketId: 0,
      title: "Fed Rate Decision — June 2026",
      description:
        "Forecast the Federal Reserve interest rate decision for the June 2026 meeting.",
      category: "Macro",
      volume: "$1.2M",
      liquidity: "$420K",
      settlement: "USDC on Arc",
      resolution: "Official Federal Reserve statement release.",
      outcomes: {
        create: [
          { onchainId: 0, label: "0.10%", probability: 25 },
          { onchainId: 1, label: "0.25%", probability: 25 },
          { onchainId: 2, label: "0.50%", probability: 25 },
          { onchainId: 3, label: "1.00%", probability: 25 },
        ],
      },
    },
  })

  await prisma.market.create({
    data: {
      onchainMarketId: 1,
      title: "US CPI YoY — July 2026",
      description:
        "Forecast the year-over-year US CPI range for the July 2026 release.",
      category: "Inflation",
      volume: "$842K",
      liquidity: "$265K",
      settlement: "USDC on Arc",
      resolution: "Official Bureau of Labor Statistics CPI release.",
      outcomes: {
        create: [
          { onchainId: 0, label: "<2.5%", probability: 25 },
          { onchainId: 1, label: "2.5–3.0%", probability: 25 },
          { onchainId: 2, label: "3.0–3.5%", probability: 25 },
          { onchainId: 3, label: ">3.5%", probability: 25 },
        ],
      },
    },
  })

  console.log("Seeded database")
}

main()