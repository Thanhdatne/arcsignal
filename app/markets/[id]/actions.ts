"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function addScenario(formData: FormData) {
  const marketId = formData.get("marketId") as string
  const label = formData.get("label") as string

  const onchainIdValue = formData.get("onchainId") as string | null

  if (!marketId || !label) {
    return
  }

  const onchainId =
    onchainIdValue !== null && onchainIdValue !== ""
      ? Number(onchainIdValue)
      : null

  await prisma.outcome.create({
    data: {
      marketId,
      label,
      onchainId,
      probability: 0,
      totalShares: 0,
    },
  })

  await prisma.activityEvent.create({
    data: {
      marketId,
      type: "scenario",
      title: "Scenario Added",
      description: label,
    },
  })

  await rebalanceMarketProbabilities(marketId)

  revalidatePath(`/markets/${marketId}`)
  revalidatePath("/markets")
}

export async function recordTrade(formData: FormData) {
  const marketId = formData.get("marketId") as string
  const outcomeId = formData.get("outcomeId") as string
  const amount = Number(formData.get("amount"))
  const wallet = String(formData.get("wallet") || "").toLowerCase()
  const txHash = String(formData.get("txHash") || "")

  if (
    !marketId ||
    !outcomeId ||
    !wallet ||
    Number.isNaN(amount) ||
    amount <= 0
  ) {
    return
  }

  const outcome = await prisma.outcome.findUnique({
    where: {
      id: outcomeId,
    },
  })

  if (!outcome) {
    return
  }

  const probability =
    outcome.probability <= 0 ? 1 : outcome.probability / 100

  const shares = amount / probability

  await prisma.trade.create({
    data: {
      amount,
      shares,
      wallet,
      txHash,
      marketId,
      outcomeId,
    },
  })

  await prisma.activityEvent.create({
    data: {
      marketId,
      type: "allocation",
      title: "Position Allocated",
      description: `${shares.toFixed(
        2
      )} ERC1155 conditional position shares minted.`,
      txHash,
    },
  })

  await prisma.outcome.update({
    where: {
      id: outcomeId,
    },
    data: {
      totalShares: outcome.totalShares + shares,
    },
  })

  const treasury = await prisma.treasury.findFirst()

  if (treasury) {
    await prisma.treasury.update({
      where: {
        id: treasury.id,
      },
      data: {
        totalValueLocked: treasury.totalValueLocked + amount,
        reserveBalance: treasury.reserveBalance + amount,
        settlementPool: treasury.settlementPool + amount,
      },
    })
  } else {
    await prisma.treasury.create({
      data: {
        totalValueLocked: amount,
        reserveBalance: amount,
        settlementPool: amount,
        pendingPayouts: 0,
      },
    })
  }

  await rebalanceMarketProbabilities(marketId)

  revalidatePath(`/markets/${marketId}`)
  revalidatePath("/markets")
  revalidatePath("/portfolio")
  revalidatePath("/claims")
  revalidatePath("/treasury")
}

async function rebalanceMarketProbabilities(marketId: string) {
  const outcomes = await prisma.outcome.findMany({
    where: {
      marketId,
    },
  })

  const totalShares = outcomes.reduce(
    (sum, outcome) => sum + outcome.totalShares,
    0
  )

  if (totalShares <= 0) {
    const equalProbability =
      outcomes.length > 0 ? 100 / outcomes.length : 0

    for (const outcome of outcomes) {
      await prisma.outcome.update({
        where: {
          id: outcome.id,
        },
        data: {
          probability: equalProbability,
        },
      })
    }

    return
  }

  for (const outcome of outcomes) {
    await prisma.outcome.update({
      where: {
        id: outcome.id,
      },
      data: {
        probability: (outcome.totalShares / totalShares) * 100,
      },
    })
  }
}