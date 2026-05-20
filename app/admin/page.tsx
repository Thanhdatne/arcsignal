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

  const pendingMarkets =
    markets.filter(
      (market) =>
        market.status ===
        "pending_resolution"
    )

  const readyToFinalize =
    pendingMarkets.filter(
      (market) =>
        market.disputeEndsAt &&
        new Date() >
          new Date(
            market.disputeEndsAt
          )
    )

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm text-emerald-300">
              Settlement Operations
            </p>

            <h1 className="text-5xl font-semibold tracking-tight">
              Settlement
            </h1>

            <p className="mt-5 max-w-3xl text-zinc-400">
              Manage oracle-backed
              settlement workflows,
              dispute windows, and final
              market settlement across Arc
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
              Total Markets
            </p>

            <h2 className="text-4xl font-semibold">
              {markets.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Pending Resolution
            </p>

            <h2 className="text-4xl font-semibold text-yellow-300">
              {pendingMarkets.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Ready To Finalize
            </p>

            <h2 className="text-4xl font-semibold text-emerald-300">
              {readyToFinalize.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Settlement Assets
            </p>

            <h2 className="text-4xl font-semibold">
              2
            </h2>

            <p className="mt-3 text-sm text-zinc-500">
              USDC / EURC
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-emerald-300">
                Resolution Queue
              </p>

              <h2 className="text-3xl font-semibold">
                Market Operations
              </h2>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
              Arc Finality Active
            </div>
          </div>

          <div className="space-y-5">
            {markets.map((market) => {
              const totalVolume =
                market.trades.reduce(
                  (sum, trade) =>
                    sum + trade.amount,
                  0
                )

              const isResolved =
                market.status ===
                "resolved"

              const isPending =
                market.status ===
                "pending_resolution"

              return (
                <div
                  key={market.id}
                  className="rounded-3xl border border-zinc-900 bg-black/40 p-6"
                >
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                          {market.category}
                        </span>

                        <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                          {
                            market.settlementAsset
                          }
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${
                            isResolved
                              ? "border-emerald-300/30 text-emerald-300"
                              : isPending
                                ? "border-yellow-300/30 text-yellow-300"
                                : "border-zinc-800 text-zinc-500"
                          }`}
                        >
                          {market.status.replace(
                            "_",
                            " "
                          )}
                        </span>
                      </div>

                      <h3 className="max-w-4xl text-2xl font-semibold">
                        {market.title}
                      </h3>

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
                        Open Settlement
                      </Link>

                      <Link
                        href={`/markets/${market.id}`}
                        className="rounded-2xl border border-zinc-800 bg-black/40 px-5 py-4 text-center text-white transition hover:border-emerald-300 hover:text-emerald-300"
                      >
                        View Market
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}