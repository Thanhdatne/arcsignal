"use client"

import { useEffect, useState } from "react"

import { useAccount } from "wagmi"

type Position = {
  id: string
  amount: number
  shares: number
  txHash: string | null
  createdAt: string

  market: {
    title: string
    status: string
  }

  outcome: {
    label: string
  }
}

type PortfolioResponse = {
  positions: Position[]

  stats: {
    totalExposure: number
    activeMarkets: number
    pendingSettlement: number
    claimableRewards: number
  }
}

export default function PortfolioPage() {
  const { address } = useAccount()

  const [data, setData] =
    useState<PortfolioResponse | null>(
      null
    )

  const stats = data?.stats ?? {
    totalExposure: 0,
    activeMarkets: 0,
    pendingSettlement: 0,
    claimableRewards: 0,
  }

  useEffect(() => {
    async function loadPortfolio() {
      if (!address) {
        setData(null)
        return
      }

      const response = await fetch(
        `/api/portfolio?wallet=${address}`
      )

      const result =
        await response.json()

      setData(result)
    }

    loadPortfolio()
  }, [address])

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <p className="mb-3 text-sm text-emerald-300">
          Exposure
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          Portfolio
        </h1>

        <p className="mt-5 max-w-3xl text-zinc-400">
          Track probabilistic market
          exposure, settlement status,
          and claimable rewards across
          Arc infrastructure.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Total Exposure
            </p>

            <h2 className="text-3xl font-semibold">
              $
              {stats.totalExposure.toFixed(
                0
              )}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Active Markets
            </p>

            <h2 className="text-3xl font-semibold">
              {stats.activeMarkets}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Pending Settlement
            </p>

            <h2 className="text-3xl font-semibold">
              $
              {stats.pendingSettlement.toFixed(
                0
              )}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Claimable Rewards
            </p>

            <h2 className="text-3xl font-semibold text-emerald-300">
              $
              {stats.claimableRewards.toFixed(
                0
              )}
            </h2>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Positions
            </h2>

            <p className="text-sm text-zinc-500">
              Arc probabilistic exposure
            </p>
          </div>

          <div className="space-y-4">
            {!address ? (
              <p className="text-zinc-500">
                Connect wallet to view
                positions.
              </p>
            ) : !data?.positions
                ?.length ? (
              <p className="text-zinc-500">
                No positions yet.
              </p>
            ) : (
              data.positions.map(
                (position) => (
                  <div
                    key={
                      position.id
                    }
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-900 bg-black/50 px-5 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-lg">
                        {
                          position.market
                            .title
                        }
                      </p>

                      <p className="mt-2 text-sm text-zinc-500">
                        Outcome:{" "}
                        {
                          position
                            .outcome
                            .label
                        }
                      </p>

                      <p className="mt-2 text-sm text-zinc-600">
                        {position.shares.toFixed(
                          2
                        )}{" "}
                        shares
                      </p>

                      {position.txHash ? (
                        <a
                          href={`https://testnet.arcscan.app/tx/${position.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex text-xs text-emerald-300"
                        >
                          View tx ↗
                        </a>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-semibold">
                        $
                        {position.amount.toFixed(
                          0
                        )}
                      </p>

                      <p
                        className={`mt-2 text-sm ${
                          position
                            .market
                            .status ===
                          "resolved"
                            ? "text-emerald-300"
                            : position
                                  .market
                                  .status ===
                                "pending_resolution"
                              ? "text-yellow-300"
                              : "text-zinc-500"
                        }`}
                      >
                        {position.market.status.replace(
                          "_",
                          " "
                        )}
                      </p>
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