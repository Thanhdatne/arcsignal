"use client"

import { useEffect, useMemo, useState } from "react"
import { parseUnits } from "viem"
import {
  useAccount,
  usePublicClient,
  useReadContracts,
  useWriteContract,
} from "wagmi"
import { toast } from "sonner"

import {
  conditionalSharesConfig,
  settlementVaultConfig,
} from "@/lib/contracts"

const ARC_SCAN_TX_URL = "https://testnet.arcscan.app/tx"

type ClaimPosition = {
  marketId: string
  marketTitle: string
  onchainMarketId: number
  winningOutcomeId: number
  payoutAmount: number
  shareAmount: number
  claimedAt?: string | null
}

type ClaimsClientProps = {
  positions?: ClaimPosition[]
}

export function ClaimsClient({
  positions: initialPositions = [],
}: ClaimsClientProps) {
  const { address } = useAccount()
  const publicClient = usePublicClient()

  const [positions, setPositions] =
    useState<ClaimPosition[]>(initialPositions)

  const [claimingId, setClaimingId] =
    useState<string | null>(null)

  const [claimTxByMarket, setClaimTxByMarket] =
    useState<Record<string, string>>({})

  const { writeContractAsync } = useWriteContract()

  async function loadClaims() {
    if (!address) {
      setPositions([])
      return
    }

    const response = await fetch(
      `/api/portfolio/claims?wallet=${address}`
    )

    const data = await response.json()
    setPositions(data.positions ?? [])
  }

  useEffect(() => {
    loadClaims()
  }, [address])

  const balanceContracts = useMemo(() => {
    if (!address) return []

    return positions.map((position) => ({
      ...conditionalSharesConfig,
      functionName: "balanceOf",
      args: [
        address,
        BigInt(
          position.onchainMarketId * 1_000_000 +
            position.winningOutcomeId
        ),
      ],
    }))
  }, [address, positions])

  const { data: balances } = useReadContracts({
    contracts: balanceContracts,
    query: {
      enabled: Boolean(address) && positions.length > 0,
      refetchInterval: 5000,
    },
  })

  async function markClaimed(
    position: ClaimPosition,
    txHash?: string
  ) {
    if (!address) return

    await fetch("/api/portfolio/claims", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        marketId: position.marketId,
        wallet: address,
        txHash,
      }),
    })
  }

  async function handleClaim(position: ClaimPosition) {
    if (!address) {
      toast.error("Connect wallet")
      return
    }

    try {
      setClaimingId(position.marketId)

      const payoutRaw = parseUnits(
        position.payoutAmount.toString(),
        6
      )

      const sharesRaw = parseUnits(
        position.shareAmount.toString(),
        6
      )

      const claimToast = toast.loading(
        "Claiming settlement..."
      )

      const hash = await writeContractAsync({
        ...settlementVaultConfig,
        functionName: "claim",
        args: [
          BigInt(position.onchainMarketId),
          BigInt(position.winningOutcomeId),
          sharesRaw,
          payoutRaw,
        ],
      })

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({
          hash,
        })
      }

      setClaimTxByMarket((current) => ({
        ...current,
        [position.marketId]: hash,
      }))

      await markClaimed(position, hash)

      toast.dismiss(claimToast)

      toast.success("Claim completed", {
        description:
          "Vault burned shares and released USDC.",
        action: {
          label: "View Tx",
          onClick: () => {
            window.open(
              `${ARC_SCAN_TX_URL}/${hash}`,
              "_blank",
              "noopener,noreferrer"
            )
          },
        },
      })

      await loadClaims()
    } catch {
      toast.dismiss()
      toast.error("Claim failed")
    } finally {
      setClaimingId(null)
    }
  }

  if (!address) {
    return (
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 text-center">
        <p className="text-zinc-500">
          Connect wallet to view claims.
        </p>
      </div>
    )
  }

  if (!positions.length) {
    return (
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 text-center">
        <p className="text-zinc-500">
          No claimable positions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {positions.map((position, index) => {
        const balanceResult = balances?.[index]

        const onchainBalance =
          balanceResult?.status === "success"
            ? balanceResult.result
            : null

        const alreadyClaimed =
          Boolean(position.claimedAt) ||
          position.payoutAmount <= 0 ||
          onchainBalance === BigInt(0)

        const claimTx =
          claimTxByMarket[position.marketId]

        return (
          <div
            key={position.marketId}
            className={`rounded-3xl border p-6 transition ${
              alreadyClaimed
                ? "border-zinc-900 bg-zinc-950/40 opacity-50"
                : "border-zinc-900 bg-zinc-950/70"
            }`}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm text-zinc-500">
                  {alreadyClaimed
                    ? "Claimed Market"
                    : "Claimable Market"}
                </p>

                <h3 className="text-2xl font-semibold">
                  {position.marketTitle}
                </h3>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <div className="rounded-full border border-zinc-800 px-4 py-2 text-zinc-300">
                    Winning Outcome #{position.winningOutcomeId}
                  </div>

                  <div className="rounded-full border border-zinc-800 px-4 py-2 text-zinc-300">
                    Shares {position.shareAmount.toFixed(2)}
                  </div>

                  <div
                    className={`rounded-full border px-4 py-2 ${
                      alreadyClaimed
                        ? "border-zinc-800 text-zinc-500"
                        : "border-emerald-300/20 bg-emerald-300/10 text-emerald-300"
                    }`}
                  >
                    {alreadyClaimed
                      ? "Already Claimed"
                      : `Payout ${position.payoutAmount.toFixed(2)} USDC`}
                  </div>

                  {claimTx ? (
                    <a
                      href={`${ARC_SCAN_TX_URL}/${claimTx}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-300 transition hover:bg-emerald-300 hover:text-black"
                    >
                      View on ArcScan
                    </a>
                  ) : null}
                </div>
              </div>

              <button
                disabled={
                  alreadyClaimed ||
                  claimingId === position.marketId
                }
                onClick={() => handleClaim(position)}
                className="rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {alreadyClaimed
                  ? "Already Claimed"
                  : claimingId === position.marketId
                    ? "Claiming..."
                    : "Claim Settlement"}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}