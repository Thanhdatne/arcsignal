"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function approveMarket(marketId: string) {
  const market = await prisma.market.findUnique({
    where: { id: marketId },
    include: { outcomes: true },
  })

  if (!market) return

  const generatedOnchainId =
    market.onchainId ?? Math.floor(Math.random() * 100000) + 1

  await prisma.market.update({
    where: { id: marketId },
    data: {
      reviewStatus: "approved",
      status: "active",
      onchainId: generatedOnchainId,
    },
  })

  for (let index = 0; index < market.outcomes.length; index++) {
    await prisma.outcome.update({
      where: { id: market.outcomes[index].id },
      data: {
        onchainId: market.outcomes[index].onchainId ?? index + 1,
      },
    })
  }

  await prisma.activityEvent.create({
    data: {
      marketId,
      type: "review",
      title: "Market Approved & Initialized",
      description:
        `Market approved and linked to Arc Market ID ${generatedOnchainId}.`,
    },
  })

  revalidatePath("/markets")
  revalidatePath("/admin")
  revalidatePath(`/admin/${marketId}`)
  revalidatePath(`/markets/${marketId}`)
}

export async function linkMarketOnchain(marketId: string) {
  const market = await prisma.market.findUnique({
    where: {
      id: marketId,
    },
    include: {
      outcomes: true,
    },
  })

  if (!market) return

  const randomMarketId =
    Math.floor(Math.random() * 100000) + 1

  await prisma.market.update({
    where: {
      id: marketId,
    },
    data: {
      onchainId: randomMarketId,
    },
  })

  for (let index = 0; index < market.outcomes.length; index++) {
    const outcome = market.outcomes[index]

    await prisma.outcome.update({
      where: {
        id: outcome.id,
      },
      data: {
        onchainId: index + 1,
      },
    })
  }

  await prisma.activityEvent.create({
    data: {
      marketId,
      type: "oracle",
      title: "Onchain Market Linked",
      description: `Arc Market ID ${randomMarketId} initialized.`,
    },
  })

  revalidatePath("/markets")
  revalidatePath(`/admin/${marketId}`)
  revalidatePath(`/markets/${marketId}`)
}

export async function resolveMarketRecord(formData: FormData) {
  const marketId = formData.get("marketId") as string
  const outcomeId = formData.get("outcomeId") as string
  const oracleSource = formData.get("oracleSource") as string
  const evidenceUrl = formData.get("evidenceUrl") as string

  await prisma.market.update({
    where: {
      id: marketId,
    },
    data: {
      status: "pending_resolution",
      winningOutcomeId: outcomeId,
      oracleSource,
      evidenceUrl,
      disputeEndsAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  })

  await prisma.activityEvent.create({
    data: {
      marketId,
      type: "oracle",
      title: "Oracle Resolution Submitted",
      description: oracleSource,
      evidenceUrl,
    },
  })

  revalidatePath("/markets")
  revalidatePath(`/admin/${marketId}`)
  revalidatePath(`/markets/${marketId}`)
}

export async function finalizeMarketRecord(marketId: string) {
  await prisma.market.update({
    where: {
      id: marketId,
    },
    data: {
      status: "resolved",
    },
  })

  await prisma.activityEvent.create({
    data: {
      marketId,
      type: "settlement",
      title: "Settlement Finalized",
      description: "Winning users can now claim rewards.",
    },
  })

  revalidatePath("/markets")
  revalidatePath("/claims")
  revalidatePath(`/admin/${marketId}`)
  revalidatePath(`/markets/${marketId}`)
}