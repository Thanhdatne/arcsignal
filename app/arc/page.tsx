import { GlowCard } from "@/components/ui/glow-card"

const primitives = [
  {
    title: "Stablecoin-native execution",
    description:
      "ArcSignal is designed around stablecoin-denominated participation, making prediction market UX more predictable for real-world users.",
  },
  {
    title: "Multi-outcome scenario markets",
    description:
      "Instead of binary yes/no markets, ArcSignal models probability distributions across multiple economic scenarios.",
  },
  {
    title: "Deterministic settlement",
    description:
      "Markets are resolved through explicit outcome selection and onchain settlement state, creating a clear audit trail.",
  },
  {
    title: "Compliance-aware architecture",
    description:
      "The system separates market creation, trading, portfolio exposure, and resolution workflows for future policy controls.",
  },
]

const steps = [
  "Create Market",
  "Add Scenarios",
  "Trade Onchain",
  "Resolve Outcome",
  "Audit Settlement",
]

export default function ArcAlignmentPage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-20">
        <p className="mb-3 text-sm font-medium text-emerald-300/90">
          ArcSignal Architecture
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight">
          Built for institutional-grade prediction markets on Arc.
        </h1>

        <p className="mt-6 max-w-3xl leading-8 text-zinc-300">
          ArcSignal is a multi-outcome forecasting market system designed to
          align with Arc&apos;s stablecoin-native execution environment,
          deterministic settlement model, and real-world financial application
          focus.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {primitives.map((primitive) => (
            <GlowCard key={primitive.title}>
              <h2 className="brand-serif text-2xl font-semibold">
                {primitive.title}
              </h2>

              <p className="mt-4 leading-7 text-zinc-300">
                {primitive.description}
              </p>
            </GlowCard>
          ))}
        </div>

        <GlowCard className="mt-16">
          <p className="mb-8 text-sm font-medium text-emerald-300/90">
            System Flow
          </p>

          <div className="relative grid gap-5 md:grid-cols-5">
            <div className="absolute left-0 top-8 hidden h-px w-full bg-gradient-to-r from-emerald-300/0 via-emerald-300/30 to-emerald-300/0 md:block" />

            {steps.map((step, index) => (
              <div
                key={step}
                className="relative rounded-2xl border border-zinc-800 bg-black p-5"
              >
                <p className="mb-4 text-xs text-emerald-300">
                  0{index + 1}
                </p>

                <p className="text-sm font-medium text-zinc-200">{step}</p>
              </div>
            ))}
          </div>
        </GlowCard>

        <GlowCard className="mt-16">
          <p className="mb-3 text-sm font-medium text-emerald-300/90">
            Current Implementation
          </p>

          <div className="space-y-4 text-zinc-300">
            <p>✅ Arc Testnet wallet connection</p>
            <p>✅ ScenarioMarket smart contract deployed on Arc Testnet</p>
            <p>✅ Onchain market creation</p>
            <p>✅ Onchain scenario trading</p>
            <p>✅ Onchain market resolution</p>
            <p>✅ Prisma index/cache for fast institutional dashboard UX</p>
          </div>
        </GlowCard>
      </div>
    </main>
  )
}