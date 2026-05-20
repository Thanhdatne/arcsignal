import { ClaimsClient } from "@/components/claims/claims-client"

export default function ClaimsPage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-20">
        <p className="mb-3 text-sm text-emerald-300">
          Settlement
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          Claims
        </h1>

        <p className="mt-5 max-w-3xl text-zinc-400">
          Redeem finalized market rewards from the settlement vault.
        </p>

        <div className="mt-12">
          <ClaimsClient />
        </div>
      </div>
    </main>
  )
}