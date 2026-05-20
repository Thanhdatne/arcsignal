"use server"

import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

export async function createMarket(
  formData: FormData
) {
  const title =
    formData.get("title") as string

  const description =
    formData.get(
      "description"
    ) as string

  const category =
    formData.get(
      "category"
    ) as string

  const settlement =
    formData.get(
      "settlement"
    ) as string

  const settlementAsset =
    formData.get(
      "settlementAsset"
    ) as string

  const accessControl =
    formData.get(
      "accessControl"
    ) as string

  const resolution =
    formData.get(
      "resolution"
    ) as string

  const outcomes = formData
    .getAll("outcomes")
    .map((outcome) =>
      String(outcome).trim()
    )
    .filter(Boolean)

  if (
    !title ||
    !description ||
    outcomes.length < 2
  ) {
    return
  }

  const initialProbability =
    100 / outcomes.length

  const market =
    await prisma.market.create({
      data: {
        title,
        description,

        category,

        settlement,
        settlementAsset,

        accessControl,
        resolution,

        volume: "0",
        liquidity: "0",

        status: "draft",

        reviewStatus:
          "pending_review",

        outcomes: {
          create: outcomes.map(
            (label) => ({
              label,

              probability:
                initialProbability,

              totalShares: 0,
            })
          ),
        },

        activities: {
          create: {
            type: "market",

            title:
              "Market Submitted",

            description: `${outcomes.length} outcomes submitted for admin approval.`,
          },
        },
      },
    })

  redirect(`/admin/${market.id}`)
}