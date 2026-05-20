"use client"

import { useEffect, useState } from "react"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { toast } from "sonner"

import { addScenario } from "@/app/markets/[id]/actions"
import { scenarioMarketConfig } from "@/lib/contracts"

type AddScenarioDialogProps = {
  marketId: string
  onchainMarketId: number | null
  nextOnchainOutcomeId: number
}

export function AddScenarioDialog({
  marketId,
  onchainMarketId,
  nextOnchainOutcomeId,
}: AddScenarioDialogProps) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [pendingLabel, setPendingLabel] = useState("")
  const [toastId, setToastId] = useState<string | number>()

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    async function saveScenarioAfterOnchainConfirm() {
      if (!isSuccess || !pendingLabel) return

      if (toastId) {
        toast.dismiss(toastId)
      }

      const formData = new FormData()

      formData.set("marketId", marketId)
      formData.set("label", pendingLabel)
      formData.set("onchainId", String(nextOnchainOutcomeId))

      await addScenario(formData)

      toast.success("Scenario added on Arc", {
        description: "The new outcome is now part of this market.",
      })

      setLabel("")
      setPendingLabel("")
      setToastId(undefined)
      setOpen(false)
    }

    saveScenarioAfterOnchainConfirm()
  }, [
    isSuccess,
    pendingLabel,
    marketId,
    nextOnchainOutcomeId,
    toastId,
  ])

  const canSubmit = onchainMarketId !== null && label.length > 0

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-2xl border border-zinc-800 px-5 py-4 font-medium text-white transition hover:bg-zinc-900"
      >
        Add Scenario
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-white shadow-2xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="mb-2 text-sm text-zinc-500">
                  Arc Onchain Proposal
                </p>

                <h2 className="text-2xl font-semibold">
                  Add New Outcome
                </h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-zinc-800 px-3 py-1 text-sm text-zinc-400 hover:bg-zinc-900"
              >
                Close
              </button>
            </div>

            <div>
              <label className="mb-3 block text-sm text-zinc-500">
                Scenario Label
              </label>

              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Spain"
                className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-700 focus:border-zinc-600"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-900 bg-black p-5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Arc Market</span>

                <span>
                  {onchainMarketId === null
                    ? "Not linked"
                    : `#${onchainMarketId}`}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-zinc-500">New Outcome ID</span>

                <span>#{nextOnchainOutcomeId}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-zinc-500">Execution</span>

                <span>Smart Contract</span>
              </div>
            </div>

            <button
              disabled={!canSubmit || isPending || isConfirming}
              onClick={() => {
                if (!canSubmit) return

                setPendingLabel(label)

                const id = toast.loading("Adding scenario on Arc...")
                setToastId(id)

                writeContract({
                  ...scenarioMarketConfig,
                  functionName: "addOutcome",
                  args: [BigInt(onchainMarketId), label],
                })
              }}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {isPending
                ? "Waiting for wallet..."
                : isConfirming
                  ? "Confirming on Arc..."
                  : "Add Onchain Scenario"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}