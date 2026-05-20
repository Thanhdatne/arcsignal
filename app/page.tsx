import Link from "next/link"

import { prisma } from "@/lib/prisma"

export default async function HomePage() {
  const markets =
    await prisma.market.findMany({
      include: {
        outcomes: true,
        trades: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 3,
    })

  const totalVolume =
    markets.reduce(
      (sum, market) =>
        sum +
        market.trades.reduce(
          (tradeSum, trade) =>
            tradeSum + trade.amount,
          0
        ),
      0
    )

  const activeMarkets =
    markets.filter(
      (market) =>
        market.status === "active"
    ).length

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <div className="max-w-5xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/5 px-4 py-2 text-sm text-emerald-300">
            Arc-Native Programmable Market Infrastructure
          </div>

          <h1 className="max-w-6xl text-6xl font-semibold leading-[1.05] tracking-tight">
            Trade probabilistic futures,
            not binaries.
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-400">
            ArcSignal transforms
            uncertainty into institutional
            probability intelligence with
            oracle-backed settlement,
            stablecoin infrastructure, and
            auditable market execution.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/markets"
              className="rounded-2xl bg-white px-6 py-4 text-lg font-medium text-black transition hover:bg-zinc-200"
            >
              Explore Markets
            </Link>

            <Link
              href="/create"
              className="rounded-2xl border border-zinc-800 bg-black/40 px-6 py-4 text-lg text-white transition hover:border-emerald-300 hover:text-emerald-300"
            >
              Create Market
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Open Interest
            </p>

            <h2 className="text-4xl font-semibold">
              $
              {totalVolume.toFixed(0)}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Active Markets
            </p>

            <h2 className="text-4xl font-semibold">
              {activeMarkets}
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

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Oracle Integrity
            </p>

            <h2 className="text-4xl font-semibold text-emerald-300">
              Verified
            </h2>
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-emerald-300">
                Live Institutional Signals
              </p>

              <h2 className="text-4xl font-semibold">
                Probability Markets
              </h2>
            </div>

            <Link
              href="/markets"
              className="text-zinc-400 transition hover:text-white"
            >
              View All Markets →
            </Link>
          </div>

          <div className="grid gap-6">
            {markets.map((market) => {
              const topOutcome =
                [...market.outcomes].sort(
                  (a, b) =>
                    b.probability -
                    a.probability
                )[0]

              const totalMarketVolume =
                market.trades.reduce(
                  (sum, trade) =>
                    sum + trade.amount,
                  0
                )

              return (
                <Link
                  key={market.id}
                  href={`/markets/${market.id}`}
                  className="group overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/80 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20"
                >
                  <div className="grid gap-8 p-8 lg:grid-cols-[1fr_320px]">
                    <div>
                      <div className="mb-5 flex flex-wrap items-center gap-3">
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
                            market.status ===
                            "resolved"
                              ? "border-emerald-300/30 text-emerald-300"
                              : market.status ===
                                  "pending_resolution"
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

                      <h3 className="max-w-4xl text-3xl font-semibold leading-tight transition group-hover:text-emerald-300">
                        {market.title}
                      </h3>

                      <p className="mt-5 max-w-3xl leading-7 text-zinc-400">
                        {
                          market.description
                        }
                      </p>

                      <div className="mt-8 flex flex-wrap gap-6 text-sm">
                        <div>
                          <p className="mb-2 text-zinc-500">
                            Open Interest
                          </p>

                          <p className="text-xl font-semibold">
                            $
                            {totalMarketVolume.toFixed(
                              0
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="mb-2 text-zinc-500">
                            Settlement
                          </p>

                          <p className="text-xl font-semibold">
                            {
                              market.settlement
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-900 bg-black/40 p-6">
                      <p className="mb-3 text-sm text-emerald-300">
                        Dominant Signal
                      </p>

                      <h4 className="text-2xl font-semibold">
                        {topOutcome?.label ||
                          "No signal"}
                      </h4>

                      <p className="mt-4 text-5xl font-semibold">
                        {topOutcome?.probability.toFixed(
                          1
                        ) || "0"}
                        %
                      </p>

                      <div className="mt-6 h-2 w-full rounded-full bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-white"
                          style={{
                            width: `${
                              topOutcome?.probability ||
                              0
                            }%`,
                          }}
                        />
                      </div>

                      <div className="mt-8 flex items-center justify-between text-sm">
                        <span className="text-zinc-500">
                          Oracle Integrity
                        </span>

                        <span className="text-emerald-300">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-24 rounded-[2rem] border border-zinc-900 bg-zinc-950/80 p-10">
          <div className="mb-10">
            <p className="mb-2 text-sm text-emerald-300">
              Institutional Settlement Architecture
            </p>

            <h2 className="text-4xl font-semibold">
              ArcSignal System Flow
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              "Create Market",
              "Aggregate Probability",
              "Oracle Resolution",
              "Final Settlement",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-zinc-900 bg-black/40 p-6"
              >
                <p className="mb-4 text-sm text-zinc-500">
                  0{index + 1}
                </p>

                <h3 className="text-2xl font-semibold">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}