import Link from "next/link"

import { prisma } from "@/lib/prisma"

export default async function AdminPage() {
  const markets =
    await prisma.market.findMany({
      include: {
        outcomes: true,
        trades: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    })

  const reviewQueue =
    markets.filter(
      (market) =>
        market.reviewStatus ===
        "pending_review"
    )

  const approvedMarkets =
    markets.filter(
      (market) =>
        market.reviewStatus ===
        "approved"
    )

  const pendingResolution =
    markets.filter(
      (market) =>
        market.status ===
        "pending_resolution"
    )

  const readyToFinalize =
    pendingResolution.filter(
      (market) =>
        market.disputeEndsAt &&
        new Date() >
          new Date(
            market.disputeEndsAt
          )
    )

  function statusLabel(
    market: (typeof markets)[number]
  ) {
    if (
      market.reviewStatus ===
      "pending_review"
    ) {
      return "Pending Review"
    }

    if (
      market.status === "draft"
    ) {
      return "Draft"
    }

    if (
      market.status === "active"
    ) {
      return "Active"
    }

    if (
      market.status ===
      "pending_resolution"
    ) {
      return "Pending Resolution"
    }

    if (
      market.status ===
      "resolved"
    ) {
      return "Finalized"
    }

    return market.status.replace(
      "_",
      " "
    )
  }

  function statusClass(
    market: (typeof markets)[number]
  ) {
    if (
      market.reviewStatus ===
      "pending_review"
    ) {
      return "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
    }

    if (
      market.status === "active"
    ) {
      return "border-emerald-300/30 bg-emerald-300/10 text-emerald-300"
    }

    if (
      market.status ===
      "pending_resolution"
    ) {
      return "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
    }

    if (
      market.status ===
      "resolved"
    ) {
      return "border-red-300/30 bg-red-300/10 text-red-300"
    }

    return "border-zinc-800 text-zinc-500"
  }

  function MarketCard({
    market,
    actionLabel,
  }: {
    market: (typeof markets)[number]

    actionLabel: string
  }) {
    const totalVolume =
      market.trades.reduce(
        (sum, trade) =>
          sum + trade.amount,
        0
      )

    return (
      <div className="rounded-3xl border border-zinc-900 bg-black/40 p-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {
                  market.category
                }
              </span>

              <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {
                  market.settlementAsset
                }
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-xs ${statusClass(
                  market
                )}`}
              >
                {statusLabel(
                  market
                )}
              </span>

              {!market.onchainId ? (
                <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-500">
                  Not initialized
                </span>
              ) : (
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-300">
                  Arc #
                  {
                    market.onchainId
                  }
                </span>
              )}
            </div>

            <h3 className="max-w-4xl text-2xl font-semibold">
              {market.title}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
              {
                market.description
              }
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div>
                <p className="mb-2 text-zinc-500">
                  Open Interest
                </p>

                <p className="text-lg font-semibold">
                  $
                  {totalVolume.toFixed(
                    0
                  )}
                </p>
              </div>

              <div>
                <p className="mb-2 text-zinc-500">
                  Settlement
                </p>

                <p className="text-lg font-semibold">
                  {
                    market.settlement
                  }
                </p>
              </div>

              <div>
                <p className="mb-2 text-zinc-500">
                  Outcomes
                </p>

                <p className="text-lg font-semibold">
                  {
                    market.outcomes
                      .length
                  }
                </p>
              </div>

              <div>
                <p className="mb-2 text-zinc-500">
                  Oracle Source
                </p>

                <p className="text-lg font-semibold">
                  {market.oracleSource ||
                    "Pending"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:w-[260px]">
            <Link
              href={`/admin/${market.id}`}
              className="rounded-2xl bg-white px-5 py-4 text-center font-medium text-black transition hover:bg-zinc-200"
            >
              {
                actionLabel
              }
            </Link>

            {market.reviewStatus ===
            "approved" ? (
              <Link
                href={`/markets/${market.id}`}
                className="rounded-2xl border border-zinc-800 bg-black/40 px-5 py-4 text-center text-white transition hover:border-emerald-300 hover:text-emerald-300"
              >
                View Market
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm text-emerald-300">
              Settlement
              Operations
            </p>

            <h1 className="text-5xl font-semibold tracking-tight">
              Admin Console
            </h1>

            <p className="mt-5 max-w-3xl text-zinc-400">
              Review submitted
              markets,
              initialize
              Arc-linked
              markets,
              monitor oracle
              workflows, and
              finalize
              settlement
              across
              ArcSignal
              infrastructure.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-4">
            <p className="mb-2 text-sm text-zinc-500">
              Oracle Integrity
            </p>

            <p className="text-2xl font-semibold text-emerald-300">
              Verified
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Review Queue
            </p>

            <h2 className="text-4xl font-semibold text-yellow-300">
              {
                reviewQueue.length
              }
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Approved
              Markets
            </p>

            <h2 className="text-4xl font-semibold text-emerald-300">
              {
                approvedMarkets.length
              }
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Pending
              Resolution
            </p>

            <h2 className="text-4xl font-semibold text-yellow-300">
              {
                pendingResolution.length
              }
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Ready To
              Finalize
            </p>

            <h2 className="text-4xl font-semibold text-emerald-300">
              {
                readyToFinalize.length
              }
            </h2>
          </div>
        </div>

        <section className="mt-14 rounded-3xl border border-yellow-300/20 bg-yellow-300/5 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-yellow-300">
                Review Queue
              </p>

              <h2 className="text-3xl font-semibold">
                Submitted
                Markets
              </h2>
            </div>

            <div className="rounded-2xl border border-yellow-300/20 bg-black/40 px-4 py-3 text-sm text-yellow-300">
              Admin approval
              required
            </div>
          </div>

          <div className="space-y-5">
            {reviewQueue.length ===
            0 ? (
              <div className="rounded-3xl border border-zinc-900 bg-black/40 p-8 text-center text-zinc-500">
                No markets
                pending
                review.
              </div>
            ) : (
              reviewQueue.map(
                (market) => (
                  <MarketCard
                    key={
                      market.id
                    }
                    market={
                      market
                    }
                    actionLabel="Review Market"
                  />
                )
              )
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-emerald-300">
                Market
                Operations
              </p>

              <h2 className="text-3xl font-semibold">
                Approved &
                Settlement
                Markets
              </h2>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
              Arc Finality
              Active
            </div>
          </div>

          <div className="space-y-5">
            {approvedMarkets.length ===
            0 ? (
              <div className="rounded-3xl border border-zinc-900 bg-black/40 p-8 text-center text-zinc-500">
                No approved
                markets yet.
              </div>
            ) : (
              approvedMarkets.map(
                (market) => (
                  <MarketCard
                    key={
                      market.id
                    }
                    market={
                      market
                    }
                    actionLabel="Open Settlement"
                  />
                )
              )
            )}
          </div>
        </section>
      </div>
    </main>
  )
}