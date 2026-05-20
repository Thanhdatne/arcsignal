import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({
      positions: [],
      stats: {
        totalExposure: 0,
        activeMarkets: 0,
        pendingSettlement: 0,
        claimableRewards: 0,
      },
    })
  }

  const positions = await prisma.trade.findMany({
    where: {
      wallet: wallet.toLowerCase(),
    },
    include: {
      market: true,
      outcome: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const totalExposure = positions.reduce(
    (sum, position) => sum + position.amount,
    0
  )

  const activeMarketIds = new Set(
    positions
      .filter((position) => position.market.status === "active")
      .map((position) => position.marketId)
  )

  const pendingSettlement = positions
    .filter((position) => position.market.status === "pending_resolution")
    .reduce((sum, position) => sum + position.amount, 0)

  const claimableRewards = positions
    .filter(
      (position) =>
        position.market.status === "resolved" &&
        position.market.winningOutcomeId === position.outcomeId
    )
    .reduce((sum, position) => sum + position.amount, 0)

  return NextResponse.json({
    positions,
    stats: {
      totalExposure,
      activeMarkets: activeMarketIds.size,
      pendingSettlement,
      claimableRewards,
    },
  })
}