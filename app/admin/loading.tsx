export default function Loading() {
  return (
    <main className="min-h-screen bg-transparent px-6 pt-32 text-white">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-4 h-4 w-40 rounded-full bg-emerald-300/20" />
        <div className="mb-10 h-14 w-96 rounded-2xl bg-zinc-900" />

        <div className="grid gap-6">
          <div className="h-56 rounded-3xl bg-zinc-950/70" />
          <div className="h-56 rounded-3xl bg-zinc-950/70" />
          <div className="h-56 rounded-3xl bg-zinc-950/70" />
        </div>
      </div>
    </main>
  )
}