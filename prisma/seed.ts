import { prisma } from "@/lib/prisma"

async function main() {
  await prisma.activityEvent.deleteMany()
  await prisma.trade.deleteMany()
  await prisma.outcome.deleteMany()
  await prisma.market.deleteMany()
  await prisma.treasury.deleteMany()

  await prisma.market.create({
    data: {
      title: "Which asset outperforms in Q1 2027?",
      description:
        "Multi-outcome market tracking relative performance across major crypto assets.",
      category: "Crypto",
      settlement: "March 31 2027",
      settlementAsset: "USDC",
      accessControl: "public",
      resolution: "Resolved using CoinGecko closing prices at settlement.",
      volume: "124000",
      liquidity: "88000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "BTC", probability: 42, totalShares: 0 },
          { label: "ETH", probability: 31, totalShares: 0 },
          { label: "SOL", probability: 22, totalShares: 0 },
          { label: "Other", probability: 5, totalShares: 0 },
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
      title: "How many Fed rate cuts occur in 2027?",
      description:
        "Prediction market tracking the number of Federal Reserve rate cuts in calendar year 2027.",
      category: "Macro",
      settlement: "December 2027",
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
          { label: "0 Cuts", probability: 18, totalShares: 0 },
          { label: "1 Cut", probability: 26, totalShares: 0 },
          { label: "2 Cuts", probability: 35, totalShares: 0 },
          { label: "3+ Cuts", probability: 21, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "Fed Market Initialized",
          description: "Macro policy market approved and published.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title: "Which AI infrastructure chain dominates in 2027?",
      description:
        "Cross-chain market tracking infrastructure dominance for AI agents and autonomous systems.",
      category: "Infrastructure",
      settlement: "September 2027",
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
          { label: "Ethereum", probability: 33, totalShares: 0 },
          { label: "Solana", probability: 36, totalShares: 0 },
          { label: "Base", probability: 17, totalShares: 0 },
          { label: "Sui", probability: 9, totalShares: 0 },
          { label: "Other", probability: 5, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "AI Infra Market Published",
          description: "AI infrastructure thesis market initialized.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title: "Who wins the 2028 US presidential election?",
      description:
        "Multi-outcome geopolitical prediction market for the 2028 United States presidential election.",
      category: "Politics",
      settlement: "November 2028",
      settlementAsset: "USDC",
      accessControl: "public",
      resolution: "Resolved using certified election results.",
      volume: "210000",
      liquidity: "144000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "Republican", probability: 47, totalShares: 0 },
          { label: "Democrat", probability: 44, totalShares: 0 },
          { label: "Independent", probability: 5, totalShares: 0 },
          { label: "Other", probability: 4, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "Election Market Activated",
          description: "High-liquidity geopolitical market published.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title: "How large will tokenized treasuries TVL be by 2027?",
      description:
        "Institutional finance market tracking growth of tokenized treasury products.",
      category: "RWA",
      settlement: "July 2027",
      settlementAsset: "USDC",
      accessControl: "institutional",
      resolution:
        "Resolved using aggregate RWA market capitalization and tokenized treasury TVL data.",
      volume: "54000",
      liquidity: "39000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "< $2B", probability: 18, totalShares: 0 },
          { label: "$2B - $5B", probability: 36, totalShares: 0 },
          { label: "$5B - $10B", probability: 31, totalShares: 0 },
          { label: "> $10B", probability: 15, totalShares: 0 },
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

  await prisma.market.create({
    data: {
      title: "Which stablecoin grows fastest in 2027?",
      description:
        "Multi-outcome stablecoin market tracking relative supply growth across major stablecoins.",
      category: "Stablecoins",
      settlement: "December 2027",
      settlementAsset: "USDC",
      accessControl: "public",
      resolution:
        "Resolved using circulating supply data from reputable stablecoin market data providers.",
      volume: "87000",
      liquidity: "57000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "USDC", probability: 34, totalShares: 0 },
          { label: "USDT", probability: 29, totalShares: 0 },
          { label: "PYUSD", probability: 16, totalShares: 0 },
          { label: "EURC", probability: 12, totalShares: 0 },
          { label: "Other", probability: 9, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "Stablecoin Growth Market Published",
          description: "Stablecoin supply growth market activated.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title: "Which L2 ecosystem leads active users in 2027?",
      description:
        "Prediction market tracking monthly active users across major Ethereum L2 ecosystems.",
      category: "Ethereum",
      settlement: "October 2027",
      settlementAsset: "USDC",
      accessControl: "public",
      resolution:
        "Resolved using public L2 analytics dashboards and verified user activity data.",
      volume: "99000",
      liquidity: "73000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "Base", probability: 39, totalShares: 0 },
          { label: "Arbitrum", probability: 24, totalShares: 0 },
          { label: "Optimism", probability: 16, totalShares: 0 },
          { label: "zkSync", probability: 11, totalShares: 0 },
          { label: "Other", probability: 10, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "L2 Ecosystem Market Published",
          description: "Ethereum scaling activity market activated.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title: "Which asset class performs best during 2027?",
      description:
        "Macro market comparing annual performance across major global asset classes.",
      category: "Macro",
      settlement: "December 2027",
      settlementAsset: "USDC",
      accessControl: "public",
      resolution:
        "Resolved using annual total return data from widely accepted financial benchmarks.",
      volume: "68000",
      liquidity: "42000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "Crypto", probability: 31, totalShares: 0 },
          { label: "Gold", probability: 19, totalShares: 0 },
          { label: "Equities", probability: 27, totalShares: 0 },
          { label: "Bonds", probability: 14, totalShares: 0 },
          { label: "Cash", probability: 9, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "Global Asset Market Published",
          description: "Cross-asset macro market activated.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title: "Which onchain payment category grows fastest by 2027?",
      description:
        "Arc-aligned market tracking growth across stablecoin-native payment categories.",
      category: "Payments",
      settlement: "November 2027",
      settlementAsset: "USDC",
      accessControl: "public",
      resolution:
        "Resolved using stablecoin payment volume data from public processors and onchain analytics.",
      volume: "112000",
      liquidity: "78000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "Remittance", probability: 22, totalShares: 0 },
          { label: "B2B Payments", probability: 31, totalShares: 0 },
          { label: "Card Settlement", probability: 17, totalShares: 0 },
          { label: "FX", probability: 20, totalShares: 0 },
          { label: "Payroll", probability: 10, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "Onchain Payments Market Published",
          description:
            "Stablecoin payment infrastructure market activated.",
        },
      },
    },
  })

  await prisma.market.create({
    data: {
      title: "Which crypto narrative dominates 2027?",
      description:
        "Multi-outcome narrative market tracking which crypto theme captures the strongest liquidity and mindshare.",
      category: "Narratives",
      settlement: "December 2027",
      settlementAsset: "USDC",
      accessControl: "public",
      resolution:
        "Resolved using market cap growth, volume, developer activity, and public narrative dominance metrics.",
      volume: "135000",
      liquidity: "96000",
      status: "active",
      reviewStatus: "approved",
      outcomes: {
        create: [
          { label: "AI Agents", probability: 33, totalShares: 0 },
          { label: "RWA", probability: 24, totalShares: 0 },
          { label: "DePIN", probability: 16, totalShares: 0 },
          { label: "Gaming", probability: 9, totalShares: 0 },
          { label: "Stablecoins", probability: 18, totalShares: 0 },
        ],
      },
      activities: {
        create: {
          type: "market",
          title: "Narrative Market Published",
          description: "Crypto narrative market activated.",
        },
      },
    },
  })

  console.log("Seeded 10 ArcSignal demo markets.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })