import Link from "next/link"

export default function CreateSuccessPage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/5 p-10">
          <p className="mb-3 text-sm text-emerald-300">
            Market Submitted
          </p>

          <h1 className="text-4xl font-semibold">
            Your market is pending review.
          </h1>

          <p className="mt-5 leading-7 text-zinc-400">
            The market has been created as a draft and submitted to the admin
            review queue. Once approved, it will be initialized and become
            available for allocation on ArcSignal.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/markets"
              className="rounded-2xl bg-white px-5 py-4 font-medium text-black"
            >
              View Markets
            </Link>

            <Link
              href="/create"
              className="rounded-2xl border border-zinc-800 px-5 py-4 text-zinc-300"
            >
              Create Another
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}