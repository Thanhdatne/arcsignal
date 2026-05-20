import { notFound } from "next/navigation"

import { prisma } from "@/lib/prisma"

import { TradeScenarioDialog } from "@/components/market/trade-scenario-dialog"
import { ClaimRewardsCard } from "@/components/market/claim-rewards-card"

export const revalidate = 0

type MarketPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function MarketPage({
  params,
}: MarketPageProps) {
  const { id } = await params

  const market = await prisma.market.findUnique({
    where: {
      id,
    },

    include: {
      outcomes: true,

      trades: {
        orderBy: {
          createdAt: "desc",
        },

        take: 20,
      },

      activities: {
        orderBy: {
          createdAt: "desc",
        },

        take: 20,
      },
    },
  })

  if (!market) {
    notFound()
  }

  const totalVolume = market.trades.reduce(
    (sum, trade) => sum + trade.amount,
    0
  )

  const isResolved = market.status === "resolved"

  const isPendingResolution =
    market.status === "pending_resolution"

  const winningOutcome = market.outcomes.find(
    (outcome) =>
      outcome.id === market.winningOutcomeId
  )

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {market.category}
              </span>

              <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {market.settlementAsset}
              </span>

              <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {market.accessControl ===
                "institutional"
                  ? "Institutional"
                  : "Public"}
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-xs ${
                  isResolved
                    ? "border-emerald-300/30 text-emerald-300"
                    : isPendingResolution
                      ? "border-yellow-300/30 text-yellow-300"
                      : "border-zinc-800 text-zinc-500"
                }`}
              >
                {isResolved
                  ? "Resolved"
                  : isPendingResolution
                    ? "Pending Resolution"
                    : "Active"}
              </span>
            </div>

            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight">
              {market.title}
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-zinc-400">
              {market.description}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
                <p className="mb-3 text-sm text-zinc-500">
                  Total Volume
                </p>

                <h2 className="text-3xl font-semibold">
                  ${totalVolume.toFixed(0)}
                </h2>
              </div>

              <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
                <p className="mb-3 text-sm text-zinc-500">
                  Settlement
                </p>

                <h2 className="text-2xl font-semibold">
                  {market.settlement}
                </h2>
              </div>

              <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
                <p className="mb-3 text-sm text-zinc-500">
                  Resolution Rule
                </p>

                <h2 className="text-lg leading-7 text-zinc-300">
                  {market.resolution}
                </h2>
              </div>
            </div>

            {(isPendingResolution || isResolved) && (
              <div className="mt-10 rounded-3xl border border-emerald-300/20 bg-emerald-300/5 p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm text-emerald-300">
                      Oracle Resolution Layer
                    </p>

                    <h2 className="text-2xl font-semibold">
                      Settlement Evidence
                    </h2>
                  </div>

                  <div
                    className={`rounded-full border px-4 py-2 text-sm ${
                      isResolved
                        ? "border-emerald-300/30 text-emerald-300"
                        : "border-yellow-300/30 text-yellow-300"
                    }`}
                  >
                    {isResolved
                      ? "Finalized"
                      : "Dispute Window Active"}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
                    <p className="mb-2 text-sm text-zinc-500">
                      Winning Outcome
                    </p>

                    <p className="text-lg">
                      {winningOutcome?.label ||
                        "Pending"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
                    <p className="mb-2 text-sm text-zinc-500">
                      Oracle Source
                    </p>

                    <p className="text-lg">
                      {market.oracleSource ||
                        "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
                    <p className="mb-2 text-sm text-zinc-500">
                      Dispute Window
                    </p>

                    <p className="text-lg">
                      {market.disputeEndsAt
                        ? new Date(
                            market.disputeEndsAt
                          ).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
                    <p className="mb-2 text-sm text-zinc-500">
                      Evidence
                    </p>

                    {market.evidenceUrl ? (
                      <a
                        href={market.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-emerald-300 transition hover:text-emerald-200"
                      >
                        View Evidence ↗
                      </a>
                    ) : (
                      <p className="text-zinc-500">
                        No evidence attached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 space-y-5">
              {market.outcomes.map(
                (outcome) => {
                  const totalShares =
                    market.outcomes.reduce(
                      (sum, item) =>
                        sum +
                        item.totalShares,
                      0
                    )

                  const dominance =
                    totalShares === 0
                      ? 0
                      : (outcome.totalShares /
                          totalShares) *
                        100

                  return (
                    <div
                      key={outcome.id}
                      className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/80"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <h3 className="text-2xl font-medium">
                              {
                                outcome.label
                              }
                            </h3>

                            <p className="mt-3 text-sm text-zinc-500">
                              Institutional
                              scenario
                              exposure
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-5xl font-semibold">
                              {outcome.probability.toFixed(
                                1
                              )}
                              %
                            </p>

                            <p className="mt-2 text-sm text-zinc-500">
                              Probability
                              Signal
                            </p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="mb-3 flex items-center justify-between text-sm">
                            <span className="text-zinc-500">
                              Liquidity
                              Depth
                            </span>

                            <span className="text-zinc-300">
                              $
                              {outcome.totalShares.toFixed(
                                0
                              )}
                            </span>
                          </div>

                          <div className="h-3 w-full overflow-hidden rounded-full bg-black">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-200 to-white transition-all duration-700"
                              style={{
                                width: `${outcome.probability}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4">
                            <p className="mb-2 text-sm text-zinc-500">
                              Capital
                              Dominance
                            </p>

                            <p className="text-2xl font-semibold">
                              {dominance.toFixed(
                                1
                              )}
                              %
                            </p>
                          </div>

                          <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4">
                            <p className="mb-2 text-sm text-zinc-500">
                              Signal
                              Strength
                            </p>

                            <p className="text-2xl font-semibold text-emerald-300">
                              {outcome.probability >
                              60
                                ? "High"
                                : outcome.probability >
                                    40
                                  ? "Moderate"
                                  : "Weak"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4">
                            <p className="mb-2 text-sm text-zinc-500">
                              Exposure
                              Units
                            </p>

                            <p className="text-2xl font-semibold">
                              {outcome.totalShares.toFixed(
                                0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>

            <div className="mt-14 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Institutional Activity Timeline
                </h2>

                <p className="text-sm text-zinc-500">
                  Arc settlement &
                  audit infrastructure
                </p>
              </div>

              <div className="space-y-4">
                {market.activities.length ===
                0 ? (
                  <p className="text-zinc-500">
                    No activity yet.
                  </p>
                ) : (
                  market.activities.map(
                    (activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-black/50 px-5 py-4"
                      >
                        <div>
                          <p className="text-lg">
                            {
                              activity.title
                            }
                          </p>

                          <p className="mt-2 text-sm text-zinc-500">
                            {
                              activity.description
                            }
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-zinc-500">
                            {new Date(
                              activity.createdAt
                            ).toLocaleString()}
                          </p>

                          {activity.txHash ? (
                            <a
                              href={`https://testnet.arcscan.app/tx/${activity.txHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex text-xs text-emerald-300"
                            >
                              View tx ↗
                            </a>
                          ) : null}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {isResolved ? (
              <ClaimRewardsCard
                marketId={market.id}
                onchainMarketId={
                  market.onchainId
                }
                settlementAsset={
                  market.settlementAsset
                }
              />
            ) : (
              <TradeScenarioDialog
                marketId={market.id}
                outcomes={market.outcomes}
                onchainMarketId={
                  market.onchainId
                }  
              />
            )}

            <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
              <div className="mb-6">
                <p className="mb-2 text-sm text-emerald-300">
                  Institutional Risk
                  Layer
                </p>

                <h2 className="text-2xl font-semibold">
                  Market
                  Infrastructure
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Arc Market ID
                  </span>

                  <span>
                    {market.onchainId ===
                    null
                      ? "Not linked"
                      : `#${market.onchainId}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Outcome Count
                  </span>

                  <span>
                    {
                      market.outcomes
                        .length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Settlement Asset
                  </span>

                  <span>
                    {
                      market.settlementAsset
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Access Policy
                  </span>

                  <span>
                    {market.accessControl ===
                    "institutional"
                      ? "Institutional Only"
                      : "Public Market"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Open Interest
                  </span>

                  <span>
                    $
                    {totalVolume.toFixed(
                      0
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Oracle Integrity
                  </span>

                  <span className="text-emerald-300">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Settlement State
                  </span>

                  <span
                    className={
                      isResolved
                        ? "text-emerald-300"
                        : isPendingResolution
                          ? "text-yellow-300"
                          : "text-zinc-300"
                    }
                  >
                    {isResolved
                      ? "Finalized"
                      : isPendingResolution
                        ? "Dispute Window"
                        : "Active"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">
                    Finality
                  </span>

                  <span>
                    Arc Instant
                  </span>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-300/15 bg-emerald-300/5 p-5">
                <p className="mb-2 text-sm text-emerald-300">
                  Settlement
                  Integrity
                </p>

                <p className="text-sm leading-7 text-zinc-400">
                  This market uses
                  oracle-backed
                  institutional
                  settlement with
                  dispute window
                  protection and
                  auditable onchain
                  execution through
                  Arc infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}