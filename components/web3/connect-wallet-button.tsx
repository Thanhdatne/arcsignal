"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { arcTestnet } from "@/lib/chains"

export function ConnectWalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const injectedConnector = connectors[0]
  const wrongNetwork = isConnected && chain?.id !== arcTestnet.id

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        {wrongNetwork ? (
          <div className="rounded-xl border border-red-900 bg-red-950 px-4 py-2 text-sm text-red-400">
            Wrong Network
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-900 bg-emerald-950 px-4 py-2 text-sm text-emerald-400">
            Arc Connected
          </div>
        )}

        <button
          onClick={() => disconnect()}
          className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-white transition hover:bg-zinc-900"
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injectedConnector })}
      className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
    >
      Connect Wallet
    </button>
  )
}