import { VaultReserveCard } from "@/components/treasury/vault-reserve-card"
import { prisma } from "@/lib/prisma"

export default async function TreasuryPage() {
  const treasury =
    await prisma.treasury.findFirst()

  const markets =
    await prisma.market.findMany({
      include: {
        trades: true,
      },
    })

  const totalMarkets = markets.length

  const activeMarkets = markets.filter(
    (market) =>
      market.status === "active"
  ).length

  const resolvedMarkets =
    markets.filter(
      (market) =>
        market.status === "resolved"
    ).length

  const totalVolume = markets.reduce(
    (sum, market) => {
      return (
        sum +
        market.trades.reduce(
          (tradeSum, trade) =>
            tradeSum + trade.amount,
          0
        )
      )
    },
    0
  )

  const pendingLiabilities =
    markets
      .filter(
        (market) =>
          market.status ===
          "pending_resolution"
      )
      .reduce((sum, market) => {
        return (
          sum +
          market.trades.reduce(
            (tradeSum, trade) =>
              tradeSum + trade.amount,
            0
          )
        )
      }, 0)

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <p className="mb-3 text-sm text-emerald-300">
          Treasury
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          Market Reserve System
        </h1>

        <p className="mt-5 max-w-3xl text-zinc-400">
          Treasury accounting,
          settlement reserves, and
          liquidity infrastructure
          across ArcSignal markets.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              TVL
            </p>

            <h2 className="text-3xl font-semibold">
              $
              {treasury?.totalValueLocked.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Reserve
            </p>

            <h2 className="text-3xl font-semibold">
              $
              {treasury?.reserveBalance.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Pending Liabilities
            </p>

            <h2 className="text-3xl font-semibold text-yellow-300">
              $
              {pendingLiabilities.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Settlement Pool
            </p>

            <h2 className="text-3xl font-semibold text-emerald-300">
              $
              {treasury?.settlementPool.toLocaleString()}
            </h2>
          </div>

          <VaultReserveCard />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-900 bg-black/40 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Markets
            </p>

            <h2 className="text-3xl font-semibold">
              {totalMarkets}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-black/40 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Active
            </p>

            <h2 className="text-3xl font-semibold">
              {activeMarkets}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-black/40 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Resolved
            </p>

            <h2 className="text-3xl font-semibold">
              {resolvedMarkets}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-black/40 p-6">
            <p className="mb-3 text-sm text-zinc-500">
              Volume
            </p>

            <h2 className="text-3xl font-semibold">
              ${totalVolume.toFixed(0)}
            </h2>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Market Exposure
            </h2>

            <p className="text-sm text-zinc-500">
              Liquidity & settlement
              accounting
            </p>
          </div>

          <div className="space-y-4">
            {markets.map((market) => {
              const exposure =
                market.trades.reduce(
                  (sum, trade) =>
                    sum + trade.amount,
                  0
                )

              return (
                <div
                  key={market.id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-black/50 px-5 py-4"
                >
                  <div>
                    <p className="text-lg">
                      {market.title}
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      {market.status.replace(
                        "_",
                        " "
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-semibold">
                      $
                      {exposure.toFixed(
                        0
                      )}
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Exposure
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}