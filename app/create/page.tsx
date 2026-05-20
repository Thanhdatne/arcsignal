import { createMarket } from "./actions"

function OutcomeInput({
  label,
  defaultValue,
}: {
  label: string
  defaultValue: string
}) {
  return (
    <div>
      <label className="mb-3 block text-sm text-zinc-500">
        {label}
      </label>

      <input
        name="outcomes"
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none focus:border-emerald-300"
      />
    </div>
  )
}

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        <p className="mb-3 text-sm text-emerald-300">Create</p>

        <h1 className="text-5xl font-semibold tracking-tight">
          Create Market
        </h1>

        <p className="mt-5 max-w-2xl text-zinc-400">
          Build programmable multi-outcome markets with stablecoin settlement,
          ERC1155 positions, and oracle-based resolution on Arc.
        </p>

        <form action={createMarket} className="mt-14 space-y-10">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
            <h2 className="text-2xl font-semibold">Market Details</h2>

            <div className="mt-8 grid gap-6">
              <div>
                <label className="mb-3 block text-sm text-zinc-500">
                  Market Title
                </label>

                <input
                  name="title"
                  placeholder="Which asset will outperform in 2026?"
                  className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-300"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm text-zinc-500">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={5}
                  placeholder="A multi-outcome prediction market tracking which listed asset performs best over the settlement window."
                  className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-300"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm text-zinc-500">
                    Category
                  </label>

                  <input
                    name="category"
                    defaultValue="Crypto"
                    className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none focus:border-emerald-300"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm text-zinc-500">
                    Settlement Date
                  </label>

                  <input
                    name="settlement"
                    placeholder="Before Jan 1, 2027"
                    className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm text-zinc-500">
                  Settlement Asset
                </label>

                <select
                  name="settlementAsset"
                  className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none focus:border-emerald-300"
                >
                  <option value="USDC">USDC</option>
                  <option value="EURC">EURC</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm text-zinc-500">
                  Access Policy
                </label>

                <select
                  name="accessControl"
                  className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none focus:border-emerald-300"
                >
                  <option value="public">Public Market</option>
                  <option value="institutional">Institutional Only</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm text-zinc-500">
                  Resolution Methodology
                </label>

                <textarea
                  name="resolution"
                  rows={4}
                  placeholder="Resolved using public market data from major exchanges at the settlement deadline."
                  className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-300"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">Outcomes</h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                  Add as many outcomes as needed. Each outcome becomes its own
                  ERC1155 conditional position after trading.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <OutcomeInput label="Outcome 1" defaultValue="YES" />
              <OutcomeInput label="Outcome 2" defaultValue="NO" />
              <OutcomeInput label="Outcome 3" defaultValue="" />
              <OutcomeInput label="Outcome 4" defaultValue="" />
              <OutcomeInput label="Outcome 5" defaultValue="" />
              <OutcomeInput label="Outcome 6" defaultValue="" />
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-300/15 bg-emerald-300/5 p-5">
              <p className="text-sm leading-6 text-zinc-400">
                Tip: leave unused outcome fields empty. Example outcomes:
                BTC / ETH / SOL, 25bps / 50bps / No Cut, or Candidate A /
                Candidate B / Other.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-6 py-5 text-lg font-medium text-black transition hover:bg-zinc-200"
          >
            Create Market
          </button>
        </form>
      </div>
    </main>
  )
}