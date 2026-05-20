"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

import { getArcscanTxUrl } from "@/lib/explorer"

type PortfolioPosition = {
  market: string
  outcome: string
  amount: number
}

type PortfolioTrade = {
  id: string
  amount: number
  wallet: string
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
  positions: PortfolioPosition[]
  trades: PortfolioTrade[]
  totalExposure: number
}

export function PortfolioClient() {
  const { address, isConnected } = useAccount()

  const [mounted, setMounted] = useState(false)

  const [data, setData] = useState<PortfolioResponse>({
    positions: [],
    trades: [],
    totalExposure: 0,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function loadPortfolio() {
      if (!address) return

      const response = await fetch(
        `/api/portfolio?wallet=${address.toLowerCase()}`
      )

      const result = await response.json()

      setData(result)
    }

    loadPortfolio()
  }, [address])

  if (!mounted) {
    return (
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-10">
        <p className="text-zinc-500">Loading portfolio...</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-10">
        <p className="text-zinc-500">
          Connect your wallet to view your ArcSignal portfolio.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="mb-3 text-sm text-zinc-500">Connected Wallet</p>

          <h2 className="text-xl text-zinc-300">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </h2>
        </div>

        <div className="rounded-3xl border border-zinc-900 bg-zinc-950 px-8 py-6">
          <p className="mb-2 text-sm text-zinc-500">Total Exposure</p>

          <h2 className="text-4xl font-semibold">
            ${data.totalExposure.toFixed(0)}
          </h2>
        </div>
      </div>

      <div className="grid gap-6">
        {data.positions.length === 0 ? (
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-10">
            <p className="text-zinc-500">
              No active positions for this wallet yet.
            </p>
          </div>
        ) : (
          data.positions.map((position) => (
            <div
              key={`${position.market}-${position.outcome}`}
              className="rounded-3xl border border-zinc-900 bg-zinc-950 p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-3 text-sm text-zinc-500">Market</p>

                  <h2 className="max-w-3xl text-2xl font-semibold">
                    {position.market}
                  </h2>

                  <div className="mt-6 inline-flex rounded-full border border-zinc-800 px-4 py-2 text-sm">
                    {position.outcome}
                  </div>
                </div>

                <div className="text-right">
                  <p className="mb-2 text-sm text-zinc-500">Position Size</p>

                  <h2 className="text-4xl font-semibold">
                    ${position.amount.toFixed(0)}
                  </h2>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 rounded-3xl border border-zinc-900 bg-zinc-950 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium">Recent Transactions</h2>

          <div className="text-sm text-zinc-500">
            Arc settlement history
          </div>
        </div>

        <div className="space-y-4">
          {data.trades.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No transactions found for this wallet.
            </p>
          ) : (
            data.trades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-black px-5 py-4"
              >
                <div>
                  <p className="text-sm text-zinc-500">
                    {trade.market.title}
                  </p>

                  <p className="mt-1 text-lg">{trade.outcome.label}</p>

                  <p className="mt-2 text-xs text-zinc-700">
                    {trade.wallet.slice(0, 6)}...{trade.wallet.slice(-4)}
                  </p>

                  <Link
                    href="#"
                    className="mt-2 inline-flex text-xs text-zinc-600"
                  >
                    {trade.market.status}
                  </Link>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold">
                    ${trade.amount.toFixed(0)}
                  </p>

                  <p className="mt-2 text-xs text-zinc-700">
                    {new Date(trade.createdAt).toLocaleString()}
                  </p>

                  {trade.txHash ? (
                    <a
                      href={getArcscanTxUrl(trade.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-xs text-emerald-300 transition hover:text-emerald-200"
                    >
                      View on ArcScan ↗
                    </a>
                  ) : (
                    <p className="mt-3 text-xs text-zinc-700">
                      No tx hash
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}