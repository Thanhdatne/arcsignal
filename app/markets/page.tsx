import Link from "next/link"

import { prisma } from "@/lib/prisma"

export const revalidate = 0

type MarketsPageProps = {
  searchParams?: Promise<{
    status?: string
    search?: string
  }>
}

const filters = [
  {
    label: "All Markets",
    href: "/markets",
    value: undefined,
  },

  {
    label: "Active",
    href: "/markets?status=active",
    value: "active",
  },

  {
    label: "Pending Resolution",
    href: "/markets?status=pending_resolution",
    value: "pending_resolution",
  },

  {
    label: "Finalized",
    href: "/markets?status=resolved",
    value: "resolved",
  },
]

export default async function MarketsPage({
  searchParams,
}: MarketsPageProps) {
  const params =
    await searchParams

  const status =
    params?.status

  const search =
    params?.search?.trim()

  const markets =
    await prisma.market.findMany({
      where: {
        reviewStatus: "approved",
        
        ...(status
          ? {
              status,
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains:
                      search,
                  },
                },

                {
                  description:
                    {
                      contains:
                        search,
                    },
                },

                {
                  category: {
                    contains:
                      search,
                  },
                },
              ],
            }
          : {}),
      },

      include: {
        outcomes: true,
        trades: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    })

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm text-emerald-300">
              Institutional Prediction
              Infrastructure
            </p>

            <h1 className="text-5xl font-semibold tracking-tight">
              Probabilistic Markets
            </h1>

            <p className="mt-5 max-w-3xl text-zinc-400">
              Institutional-grade
              multi-outcome prediction
              markets with
              oracle-backed settlement
              on Arc.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map(
              (filter) => {
                const active =
                  status ===
                    filter.value ||
                  (!status &&
                    !filter.value)

                return (
                  <Link
                    key={
                      filter.label
                    }
                    href={
                      filter.href
                    }
                    className={
                      active
                        ? "rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-300"
                        : "rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-white hover:text-white"
                    }
                  >
                    {
                      filter.label
                    }
                  </Link>
                )
              }
            )}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form
              action="/markets"
              className="w-full lg:max-w-xl"
            >
              <div className="relative">
                <input
                  name="search"
                  defaultValue={
                    search ?? ""
                  }
                  placeholder="Search markets, assets, narratives..."
                  className="w-full rounded-2xl border border-zinc-900 bg-black/60 px-5 py-4 pr-14 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                />

                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400 transition hover:border-emerald-300 hover:text-emerald-300"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
                Settlement:
                USDC / EURC
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
                Arc Finality
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6">
          {markets.length ===
          0 ? (
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-10 text-center text-zinc-500">
              No markets found.
            </div>
          ) : (
            markets.map(
              (market) => {
                const totalVolume =
                  market.trades.reduce(
                    (
                      sum,
                      trade
                    ) =>
                      sum +
                      trade.amount,
                    0
                  )

                const topOutcome =
                  [
                    ...market.outcomes,
                  ].sort(
                    (
                      a,
                      b
                    ) =>
                      b.probability -
                      a.probability
                  )[0]

                return (
                  <Link
                    key={
                      market.id
                    }
                    href={`/markets/${market.id}`}
                    className="group overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/80 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20"
                  >
                    <div className="p-8">
                      <div className="mb-6 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${
                            market.status ===
                            "active"
                              ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300"
                              : market.status ===
                                    "pending_resolution"
                                ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
                                : "border-red-300/30 bg-red-300/10 text-red-300"
                          }`}
                        >
                          {market.status ===
                          "active"
                            ? "Active"
                            : market.status ===
                                  "pending_resolution"
                              ? "Pending Resolution"
                              : "Finalized"}
                        </span>
                      </div>

                      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                        <div>
                          <h2 className="max-w-4xl text-3xl font-semibold leading-tight transition group-hover:text-emerald-300">
                            {
                              market.title
                            }
                          </h2>

                          <p className="mt-5 max-w-3xl leading-7 text-zinc-400">
                            {
                              market.description
                            }
                          </p>

                          <div className="mt-8 flex flex-wrap gap-6 text-sm">
                            <div>
                              <p className="mb-2 text-zinc-500">
                                Open
                                Interest
                              </p>

                              <p className="text-xl font-semibold">
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

                              <p className="text-xl font-semibold">
                                {
                                  market.settlement
                                }
                              </p>
                            </div>

                            <div>
                              <p className="mb-2 text-zinc-500">
                                Outcomes
                              </p>

                              <p className="text-xl font-semibold">
                                {
                                  market
                                    .outcomes
                                    .length
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-zinc-900 bg-black/40 p-6">
                          <p className="mb-3 text-sm text-emerald-300">
                            Dominant
                            Probability
                            Signal
                          </p>

                          <h3 className="text-2xl font-semibold">
                            {topOutcome?.label ||
                              "No signal"}
                          </h3>

                          <p className="mt-4 text-5xl font-semibold">
                            {topOutcome?.probability.toFixed(
                              1
                            ) ||
                              "0"}
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
                              Oracle
                              Integrity
                            </span>

                            <span className="text-emerald-300">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              }
            )
          )}
        </div>
      </div>
    </main>
  )
}