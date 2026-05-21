import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({
      positions: [],
    })
  }

  const markets =
    await prisma.market.findMany({
      where: {
        status: "resolved",

        winningOutcomeId: {
          not: null,
        },
      },

      include: {
        outcomes: true,
        trades: true,
      },
    })

  const positions = markets
    .map((market) => {
      const winningOutcome =
        market.outcomes.find(
          (outcome) =>
            outcome.id ===
            market.winningOutcomeId
        )

      if (
        !winningOutcome ||
        !market.onchainId ||
        !winningOutcome.onchainId
      ) {
        return null
      }

      const settlementPool =
        market.trades.reduce(
          (sum, trade) =>
            sum + trade.amount,
          0
        )

      const totalWinningShares =
        market.trades
          .filter(
            (trade) =>
              trade.outcomeId ===
              winningOutcome.id
          )
          .reduce(
            (sum, trade) =>
              sum + trade.shares,
            0
          )

      const userWinningTrades =
        market.trades.filter(
          (trade) =>
            trade.wallet.toLowerCase() ===
              wallet.toLowerCase() &&
            trade.outcomeId ===
              winningOutcome.id
        )

      if (
        !userWinningTrades.length ||
        totalWinningShares <= 0
      ) {
        return null
      }

      const unclaimedTrades =
        userWinningTrades.filter(
          (trade) =>
            !trade.claimedAt
        )

      const unclaimedShares =
        unclaimedTrades.reduce(
          (sum, trade) =>
            sum + trade.shares,
          0
        )

      const payoutAmount =
        unclaimedShares > 0
          ? (unclaimedShares /
              totalWinningShares) *
            settlementPool
          : 0

      const latestClaimedTrade =
        userWinningTrades.find(
          (trade) =>
            trade.claimedAt
        )

      const latestClaimedAt =
        latestClaimedTrade
          ?.claimedAt ?? null

      const claimTxHash =
        latestClaimedTrade
          ?.claimTxHash ?? null

      return {
        marketId: market.id,

        marketTitle:
          market.title,

        onchainMarketId:
          market.onchainId,

        winningOutcomeId:
          winningOutcome.onchainId,

        payoutAmount,

        shareAmount:
          unclaimedShares,

        claimedAt:
          unclaimedShares <= 0
            ? latestClaimedAt
            : null,

        claimTxHash:
          unclaimedShares <= 0
            ? claimTxHash
            : null,
      }
    })
    .filter(Boolean)

  return NextResponse.json({
    positions,
  })
}

export async function POST(
  request: Request
) {
  const body =
    await request.json()

  const marketId = String(
    body.marketId || ""
  )

  const wallet = String(
    body.wallet || ""
  ).toLowerCase()

  const txHash = String(
    body.txHash || ""
  )

  if (!marketId || !wallet) {
    return NextResponse.json(
      { ok: false },
      { status: 400 }
    )
  }

  const market =
    await prisma.market.findUnique({
      where: {
        id: marketId,
      },
    })

  if (
    !market?.winningOutcomeId
  ) {
    return NextResponse.json(
      { ok: false },
      { status: 400 }
    )
  }

  await prisma.trade.updateMany({
    where: {
      marketId,

      wallet,

      outcomeId:
        market.winningOutcomeId,

      claimedAt: null,
    },

    data: {
      claimedAt: new Date(),

      claimTxHash:
        txHash || null,
    },
  })

  return NextResponse.json({
    ok: true,
  })
}