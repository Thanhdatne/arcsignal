"use client"

import { useEffect, useState } from "react"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { toast } from "sonner"

import { scenarioMarketConfig } from "@/lib/contracts"
import { resolveMarketRecord } from "@/app/admin/[id]/actions"

type Outcome = {
  id: string
  onchainId: number | null
  label: string
  probability: number
}

type ResolveMarketFormProps = {
  marketId: string
  onchainMarketId: number | null
  outcomes: Outcome[]
}

export function ResolveMarketForm({
  marketId,
  onchainMarketId,
  outcomes,
}: ResolveMarketFormProps) {
  const [selectedOutcomeId, setSelectedOutcomeId] = useState("")
  const [oracleSource, setOracleSource] = useState("")
  const [evidenceUrl, setEvidenceUrl] = useState("")
  const [pendingOutcomeId, setPendingOutcomeId] = useState("")
  const [toastId, setToastId] = useState<string | number>()

  const selectedOutcome = outcomes.find(
    (outcome) => outcome.id === selectedOutcomeId
  )

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    async function saveResolutionAfterConfirm() {
      if (!isSuccess || !pendingOutcomeId) return

      if (toastId) {
        toast.dismiss(toastId)
      }

      const formData = new FormData()

      formData.set("marketId", marketId)
      formData.set("outcomeId", pendingOutcomeId)
      formData.set("oracleSource", oracleSource)
      formData.set("evidenceUrl", evidenceUrl)

      await resolveMarketRecord(formData)

      toast.success("Oracle resolution submitted", {
        description:
          "The market has entered a 24h dispute window before final settlement.",
      })
    }

    saveResolutionAfterConfirm()
  }, [
    isSuccess,
    pendingOutcomeId,
    marketId,
    oracleSource,
    evidenceUrl,
    toastId,
  ])

  const canResolve =
    onchainMarketId !== null &&
    selectedOutcome?.onchainId !== null &&
    oracleSource.length > 0 &&
    evidenceUrl.length > 0

  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-zinc-500">Select Winning Scenario</p>

      <div className="grid gap-4 md:grid-cols-2">
        {outcomes.map((outcome) => (
          <button
            type="button"
            key={outcome.id}
            onClick={() => setSelectedOutcomeId(outcome.id)}
            className={`rounded-2xl border bg-black/70 p-5 text-left transition ${
              selectedOutcomeId === outcome.id
                ? "border-emerald-300"
                : "border-zinc-800 hover:border-white"
            }`}
          >
            <p className="text-lg">{outcome.label}</p>

            <p className="mt-2 text-sm text-zinc-600">
              {outcome.probability.toFixed(1)}% market probability
            </p>

            <p className="mt-2 text-xs text-zinc-700">
              Onchain outcome:{" "}
              {outcome.onchainId === null ? "not linked" : `#${outcome.onchainId}`}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-3 block text-sm text-zinc-500">
            Oracle Source
          </label>

          <input
            value={oracleSource}
            onChange={(event) => setOracleSource(event.target.value)}
            placeholder="Official FIFA / BLS / Federal Reserve release"
            className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-300"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm text-zinc-500">
            Evidence URL
          </label>

          <input
            value={evidenceUrl}
            onChange={(event) => setEvidenceUrl(event.target.value)}
            placeholder="https://..."
            className="w-full rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 text-white outline-none placeholder:text-zinc-700 focus:border-emerald-300"
          />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5">
        <p className="mb-2 text-sm text-emerald-300">
          Dispute Window
        </p>

        <p className="text-sm leading-7 text-zinc-400">
          Submitting this resolution will write the outcome to the Arc contract
          and open a 24-hour dispute window in the ArcSignal index layer before
          rewards become final.
        </p>
      </div>

      <button
        disabled={!canResolve || isPending || isConfirming}
        onClick={() => {
          if (!canResolve || !selectedOutcome) return

          setPendingOutcomeId(selectedOutcome.id)

          const id = toast.loading("Submitting oracle resolution on Arc...")
          setToastId(id)

          writeContract({
            ...scenarioMarketConfig,
            functionName: "resolveMarket",
            args: [
              BigInt(onchainMarketId),
              BigInt(selectedOutcome.onchainId as number),
            ],
          })
        }}
        className="mt-8 w-full rounded-2xl bg-emerald-300 px-6 py-4 font-medium text-black transition hover:bg-emerald-200 disabled:opacity-50"
      >
        {isPending
          ? "Waiting for wallet..."
          : isConfirming
            ? "Confirming on Arc..."
            : canResolve
              ? "Submit Oracle Resolution"
              : "Select outcome and evidence"}
      </button>
    </div>
  )
}