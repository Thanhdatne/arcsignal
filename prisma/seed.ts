import { prisma } from "@/lib/prisma"

async function main() {
  await prisma.market.createMany({
    data: [],
  })

  await prisma.market.create({
    data: {
      title:
        "Which asset outperforms in Q1 2027?",

      description:
        "Multi-outcome market tracking relative performance across major crypto assets.",

      category: "Crypto",

      settlement:
        "March 31 2027",

      settlementAsset: "USDC",

      accessControl: "public",

      resolution:
        "Resolved using CoinGecko closing prices at settlement.",

      volume: "124000",
      liquidity: "88000",

      status: "active",
      reviewStatus: "approved",

      outcomes: {
        create: [
          {
            label: "BTC",
            probability: 42,
            totalShares: 0,
          },

          {
            label: "ETH",
            probability: 31,
            totalShares: 0,
          },

          {
            label: "SOL",
            probability: 27,
            totalShares: 0,
          },
        ],
      },

      activities: {
        create: {
          type: "market",
          title: "Market Approved",
          description:
            "Institutional crypto rotation market activated.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title:
        "How many Fed rate cuts occur in 2027?",

      description:
        "Prediction market tracking the number of Federal Reserve rate cuts in calendar year 2027.",

      category: "Macro",

      settlement:
        "December 2027",

      settlementAsset: "USDC",

      accessControl: "public",

      resolution:
        "Resolved using official Federal Reserve target rate announcements.",

      volume: "92000",
      liquidity: "61000",

      status: "active",
      reviewStatus: "approved",

      outcomes: {
        create: [
          {
            label: "0 Cuts",
            probability: 18,
            totalShares: 0,
          },

          {
            label: "1-2 Cuts",
            probability: 51,
            totalShares: 0,
          },

          {
            label: "3+ Cuts",
            probability: 31,
            totalShares: 0,
          },
        ],
      },

      activities: {
        create: {
          type: "market",
          title: "Fed Market Initialized",
          description:
            "Macro policy market approved and published.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title:
        "Which AI infrastructure chain dominates in 2027?",

      description:
        "Cross-chain market tracking infrastructure dominance for AI agents and autonomous systems.",

      category: "Infrastructure",

      settlement:
        "September 2027",

      settlementAsset: "USDC",

      accessControl: "public",

      resolution:
        "Resolved using combined developer activity and onchain throughput metrics.",

      volume: "76000",
      liquidity: "52000",

      status: "active",
      reviewStatus: "approved",

      outcomes: {
        create: [
          {
            label: "Ethereum",
            probability: 38,
            totalShares: 0,
          },

          {
            label: "Solana",
            probability: 41,
            totalShares: 0,
          },

          {
            label: "Base",
            probability: 14,
            totalShares: 0,
          },

          {
            label: "Sui",
            probability: 7,
            totalShares: 0,
          },
        ],
      },

      activities: {
        create: {
          type: "market",
          title: "AI Infra Market Published",
          description:
            "AI infrastructure thesis market initialized.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title:
        "Who wins the 2028 US presidential election?",

      description:
        "Multi-outcome geopolitical prediction market for the 2028 United States presidential election.",

      category: "Politics",

      settlement:
        "November 2028",

      settlementAsset: "USDC",

      accessControl: "public",

      resolution:
        "Resolved using certified election results.",

      volume: "210000",
      liquidity: "144000",

      status: "active",
      reviewStatus: "approved",

      outcomes: {
        create: [
          {
            label: "Republican",
            probability: 49,
            totalShares: 0,
          },

          {
            label: "Democrat",
            probability: 46,
            totalShares: 0,
          },

          {
            label: "Independent",
            probability: 5,
            totalShares: 0,
          },
        ],
      },

      activities: {
        create: {
          type: "market",
          title: "Election Market Activated",
          description:
            "High-liquidity geopolitical market published.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title:
        "Will tokenized treasuries exceed $5B TVL by 2027?",

      description:
        "Institutional finance market tracking growth of tokenized treasury products.",

      category: "RWA",

      settlement:
        "July 2027",

      settlementAsset: "USDC",

      accessControl: "institutional",

      resolution:
        "Resolved using aggregate RWA market capitalization data.",

      volume: "54000",
      liquidity: "39000",

      status: "active",
      reviewStatus: "approved",

      outcomes: {
        create: [
          {
            label: "Yes",
            probability: 72,
            totalShares: 0,
          },

          {
            label: "No",
            probability: 28,
            totalShares: 0,
          },
        ],
      },

      activities: {
        create: {
          type: "market",
          title: "RWA Treasury Market Published",
          description:
            "Institutional treasury exposure market activated.",
        },
      },
    },
  })

  console.log(
    "ArcSignal demo markets seeded."
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })