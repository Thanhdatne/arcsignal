"use client"

import { formatUnits } from "viem"
import { useReadContract } from "wagmi"

import { settlementVaultConfig } from "@/lib/contracts"

export function VaultReserveCard() {
  const { data, isLoading } = useReadContract({
    ...settlementVaultConfig,
    functionName: "vaultBalance",
    query: {
      refetchInterval: 5000,
    },
  })

  const balance = data ? Number(formatUnits(data, 6)) : 0

  return (
    <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/5 p-6">
      <p className="mb-3 text-sm text-emerald-300">Onchain Vault</p>

      <h2 className="text-3xl font-semibold">
        {isLoading ? "..." : `${balance.toFixed(2)} USDC`}
      </h2>

      <p className="mt-3 break-all text-xs text-zinc-500">
        {process.env.NEXT_PUBLIC_SETTLEMENT_VAULT_ADDRESS}
      </p>
    </div>
  )
}