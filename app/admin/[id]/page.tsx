import { notFound } from "next/navigation"

import { prisma } from "@/lib/prisma"

import {
  approveMarket,
  finalizeMarketRecord,
  linkMarketOnchain,
} from "./actions"

import { ResolveMarketForm } from "@/components/admin/resolve-market-form"
import { FinalizeSettlementButton } from "@/components/admin/finalize-settlement-button"

type AdminMarketPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function AdminMarketPage({
  params,
}: AdminMarketPageProps) {
  const { id } = await params

  const market = await prisma.market.findUnique({
    where: {
      id,
    },

    include: {
      outcomes: true,

      activities: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!market) {
    notFound()
  }

  const isPendingReview =
    market.reviewStatus ===
    "pending_review"

  const isApproved =
    market.reviewStatus ===
    "approved"

  const isPendingResolution =
    market.status ===
    "pending_resolution"

  const canFinalize =
    isPendingResolution &&
    market.disputeEndsAt &&
    new Date(
      market.disputeEndsAt
    ) <= new Date()

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <p className="mb-3 text-sm text-emerald-300">
          Oracle Resolution
          Console
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          Settlement
          Control
        </h1>

        <p className="mt-5 max-w-3xl text-zinc-400">
          Review submitted
          markets,
          initialize Arc
          market IDs,
          submit oracle
          outcomes, and
          finalize
          settlement after
          the dispute
          window.
        </p>

        <div className="mt-14 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm text-zinc-500">
              Market
            </p>

            <h2 className="text-3xl font-semibold">
              {market.title}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
              <p className="mb-3 text-sm text-zinc-500">
                Review
              </p>

              <h3
                className={`text-2xl font-semibold ${
                  isApproved
                    ? "text-emerald-300"
                    : "text-yellow-300"
                }`}
              >
                {isApproved
                  ? "Approved"
                  : "Pending"}
              </h3>
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
              <p className="mb-3 text-sm text-zinc-500">
                Arc Market ID
              </p>

              <h3 className="text-2xl font-semibold">
                {market.onchainId ??
                  "Awaiting Arc Initialization"}
              </h3>
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
              <p className="mb-3 text-sm text-zinc-500">
                Status
              </p>

              <h3 className="text-2xl font-semibold capitalize">
                {market.status.replace(
                  "_",
                  " "
                )}
              </h3>
            </div>
          </div>

          {isPendingReview ? (
            <form
              action={async () => {
                "use server"

                await approveMarket(
                  market.id
                )
              }}
              className="mt-6"
            >
              <button
                type="submit"
                className="w-full rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-sm font-medium text-emerald-300 transition hover:bg-emerald-300 hover:text-black"
              >
                Approve Market
              </button>
            </form>
          ) : null}

          {isApproved &&
          !market.onchainId ? (
            <form
              action={async () => {
                "use server"

                await linkMarketOnchain(
                  market.id
                )
              }}
              className="mt-6"
            >
              <button
                type="submit"
                className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Initialize Arc
                Market
              </button>
            </form>
          ) : null}

          <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5">
            <p className="text-sm text-emerald-300">
              Arc Initialization
            </p>

            <p className="mt-2 text-zinc-400">
              Once approved,
              the market is
              assigned an
              Arc-linked
              identifier and
              activated for
              allocation
              routing across
              ArcSignal
              infrastructure.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-900 bg-black/40 p-5">
            <p className="mb-3 text-sm text-zinc-500">
              Original
              Resolution Rule
            </p>

            <p className="leading-relaxed text-zinc-300">
              {market.resolution ||
                "No resolution source provided."}
            </p>
          </div>

          {isApproved ? (
            <div className="mt-8">
              <ResolveMarketForm
                marketId={
                  market.id
                }
                onchainMarketId={
                  market.onchainId
                }
                outcomes={
                  market.outcomes
                }
              />
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-yellow-300/20 bg-yellow-300/5 p-5 text-sm text-yellow-300">
              Approve this
              market before
              initializing
              Arc settlement
              or submitting
              oracle
              resolution.
            </div>
          )}

          {isPendingResolution ? (
            <FinalizeSettlementButton
              marketId={
                market.id
              }
              disputeEndsAt={
                market.disputeEndsAt
              }
              disabled={
                !canFinalize
              }
            />
          ) : null}
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-emerald-300">
                Activity
              </p>

              <h2 className="text-3xl font-semibold">
                Settlement
                Timeline
              </h2>
            </div>

            <p className="text-sm text-zinc-500">
              Review, oracle &
              treasury
              activity
            </p>
          </div>

          <div className="space-y-4">
            {market.activities
              .length === 0 ? (
              <p className="text-zinc-500">
                No activity
                yet.
              </p>
            ) : (
              market.activities.map(
                (activity) => (
                  <div
                    key={
                      activity.id
                    }
                    className="rounded-2xl border border-zinc-900 bg-black/40 p-5"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <p className="text-lg font-medium">
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
                        <p className="text-sm uppercase tracking-wide text-emerald-300">
                          {
                            activity.type
                          }
                        </p>

                        <p className="mt-2 text-xs text-zinc-500">
                          {new Date(
                            activity.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </main>
  )
}