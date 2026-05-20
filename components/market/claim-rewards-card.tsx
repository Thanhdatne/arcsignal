"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

type ClaimRewardsCardProps = {
  marketId: string
  onchainMarketId: number | null
  settlementAsset: string
}

type ClaimResponse = {
  canClaim: boolean
  winningAmount: number
  winningShares: number
  totalWinningShares: number
  settlementPool: number
}

export function ClaimRewardsCard({
  marketId,
  settlementAsset,
}: ClaimRewardsCardProps) {
  const { address } = useAccount()

  const [loading, setLoading] = useState(true)

  const [claimData, setClaimData] =
    useState<ClaimResponse | null>(null)

  useEffect(() => {
    async function loadClaimData() {
      if (!address) return

      setLoading(true)

      const response = await fetch(
        `/api/claims?wallet=${address}&marketId=${marketId}`
      )

      const data = await response.json()

      setClaimData(data)

      setLoading(false)
    }

    loadClaimData()
  }, [address, marketId])

  return (
    <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
      <div className="mb-6">
        <p className="mb-2 text-sm text-emerald-300">
          Settlement
        </p>

        <h2 className="text-2xl font-semibold">
          Claim Rewards
        </h2>
      </div>

      {loading ? (
        <p className="text-zinc-500">
          Loading settlement data...
        </p>
      ) : !claimData?.canClaim ? (
        <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
          <p className="text-zinc-400">
            No claimable rewards.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
              <p className="mb-2 text-sm text-zinc-500">
                Claimable Amount
              </p>

              <h3 className="text-4xl font-semibold text-emerald-300">
                {claimData.winningAmount.toFixed(2)}{" "}
                {settlementAsset}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
                <p className="mb-2 text-sm text-zinc-500">
                  Winning Shares
                </p>

                <p className="text-2xl font-semibold">
                  {claimData.winningShares.toFixed(
                    2
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5">
                <p className="mb-2 text-sm text-zinc-500">
                  Settlement Pool
                </p>

                <p className="text-2xl font-semibold">
                  $
                  {claimData.settlementPool.toFixed(
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full rounded-2xl bg-emerald-300 px-5 py-4 text-base font-medium text-black transition hover:opacity-90">
            Redeem Settlement
          </button>
        </>
      )}
    </div>
  )
}