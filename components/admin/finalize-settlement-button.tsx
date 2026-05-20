"use client"

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react"

import { toast } from "sonner"

import { finalizeMarketRecord } from "@/app/admin/[id]/actions"

type FinalizeSettlementButtonProps =
  {
    marketId: string

    disputeEndsAt:
      | string
      | Date
      | null

    disabled?: boolean
  }

export function FinalizeSettlementButton({
  marketId,
  disputeEndsAt,
  disabled,
}: FinalizeSettlementButtonProps) {
  const [
    pending,
    startTransition,
  ] = useTransition()

  const [now, setNow] =
    useState(Date.now())

  useEffect(() => {
    const interval =
      setInterval(() => {
        setNow(Date.now())
      }, 1000)

    return () =>
      clearInterval(interval)
  }, [])

  const disputeEnd =
    disputeEndsAt
      ? new Date(
          disputeEndsAt
        ).getTime()
      : null

  const remainingMs =
    disputeEnd
      ? disputeEnd - now
      : 0

  const canFinalize =
    !disabled &&
    disputeEnd !== null &&
    remainingMs <= 0

  const formattedCountdown =
    useMemo(() => {
      if (remainingMs <= 0)
        return "Dispute window completed"

      const totalSeconds =
        Math.floor(
          remainingMs / 1000
        )

      const hours = Math.floor(
        totalSeconds / 3600
      )

      const minutes =
        Math.floor(
          (totalSeconds %
            3600) /
            60
        )

      const seconds =
        totalSeconds % 60

      return `${hours}h ${minutes}m ${seconds}s remaining`
    }, [remainingMs])

  return (
    <div className="mt-8 rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm text-zinc-500">
            Settlement
            Finalization
          </p>

          <h3 className="text-xl font-semibold">
            Dispute Window
            Control
          </h3>
        </div>

        <div
          className={`rounded-full border px-4 py-2 text-xs ${
            canFinalize
              ? "border-emerald-300/30 text-emerald-300"
              : "border-yellow-300/30 text-yellow-300"
          }`}
        >
          {canFinalize
            ? "Ready to Finalize"
            : "Dispute Active"}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-zinc-900 bg-black/40 p-5">
        <p className="mb-2 text-sm text-zinc-500">
          Settlement Timer
        </p>

        <p className="text-lg">
          {
            formattedCountdown
          }
        </p>
      </div>

      <button
        disabled={
          !canFinalize ||
          pending
        }
        onClick={() => {
          const formData =
            new FormData()

          formData.set(
            "marketId",
            marketId
          )

          startTransition(
            async () => {
              try {
                await finalizeMarketRecord(
                  marketId
                )

                toast.success(
                  "Settlement finalized",
                  {
                    description:
                      "Winning users can now claim rewards.",
                  }
                )
              } catch {
                toast.error(
                  "Dispute window still active."
                )
              }
            }
          )
        }}
        className="w-full rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending
          ? "Finalizing Settlement..."
          : canFinalize
            ? "Finalize Settlement"
            : "Waiting For Dispute Window"}
      </button>
    </div>
  )
}