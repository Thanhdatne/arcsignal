"use client"

import { useEffect, useState } from "react"

import { parseUnits } from "viem"

import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"

import { toast } from "sonner"

import { erc20Abi } from "@/lib/abi/erc20"

import {
  settlementVaultConfig,
} from "@/lib/contracts"

import { recordTrade } from "@/app/markets/[id]/actions"

const ARC_USDC_ERC20 =
  "0x3600000000000000000000000000000000000000"

type Outcome = {
  id: string
  onchainId: number | null
  label: string
  probability: number
}

type TradeScenarioDialogProps = {
  marketId: string
  onchainMarketId: number | null
  outcomes: Outcome[]
}

export function TradeScenarioDialog({
  marketId,
  onchainMarketId,
  outcomes,
}: TradeScenarioDialogProps) {
  const { address } = useAccount()

  const [open, setOpen] =
    useState(false)

  const [
    selectedOutcomeIndex,
    setSelectedOutcomeIndex,
  ] = useState(0)

  const [amount, setAmount] =
    useState("1")

  const [phase, setPhase] =
    useState<
      "idle" | "approve" | "deposit"
    >("idle")

  const [toastId, setToastId] =
    useState<string | number>()

  const [pendingTrade, setPendingTrade] =
    useState<{
      outcomeId: string
      outcomeOnchainId: number
      amount: number
      amountRaw: bigint
      sharesRaw: bigint
    } | null>(null)

  const {
    writeContract,
    data: hash,
    isPending,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
  } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    async function continueFlow() {
      if (
        !isSuccess ||
        !pendingTrade
      )
        return

      if (toastId) {
        toast.dismiss(toastId)
      }

      if (phase === "approve") {
        toast.success(
          "USDC approved"
        )

        setPhase("deposit")

        const depositToast =
          toast.loading(
            "Depositing into vault..."
          )

        setToastId(depositToast)

        writeContract({
          ...settlementVaultConfig,

          functionName:
            "deposit",

          args: [
            BigInt(
              onchainMarketId || 0
            ),

            BigInt(
              pendingTrade.outcomeOnchainId
            ),

            pendingTrade.amountRaw,

            pendingTrade.sharesRaw,
          ],
        })

        return
      }

      if (phase === "deposit") {
        const formData =
          new FormData()

        formData.set(
          "marketId",
          marketId
        )

        formData.set(
          "outcomeId",
          pendingTrade.outcomeId
        )

        formData.set(
          "amount",
          String(
            pendingTrade.amount
          )
        )

        formData.set(
          "wallet",
          address || ""
        )

        formData.set(
          "txHash",
          hash as string
        )

        await recordTrade(
          formData
        )

        toast.success(
          "Vault deposit confirmed",
          {
            description:
              "ERC1155 conditional shares minted.",
          }
        )

        setPendingTrade(null)

        setPhase("idle")

        setToastId(undefined)

        setOpen(false)
      }
    }

    continueFlow()
  }, [
    isSuccess,
    pendingTrade,
    phase,
    marketId,
    address,
    writeContract,
    onchainMarketId,
    toastId,
  ])

  const selectedOutcome =
    outcomes[selectedOutcomeIndex]

  const canTrade =
    onchainMarketId !== null &&
    selectedOutcome?.onchainId !==
      null &&
    Boolean(address)

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:opacity-90"
      >
        Allocate Position
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-white shadow-2xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="mb-2 text-sm text-zinc-500">
                  Arc Testnet
                </p>

                <h2 className="text-2xl font-semibold">
                  Vault Trade
                </h2>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-full border border-zinc-800 px-3 py-1 text-sm text-zinc-400 hover:bg-zinc-900"
              >
                Close
              </button>
            </div>

            <div>
              <label className="mb-3 block text-sm text-zinc-500">
                Select Scenario
              </label>

              <div className="space-y-3">
                {outcomes.map(
                  (
                    outcome,
                    index
                  ) => (
                    <button
                      type="button"
                      key={outcome.id}
                      onClick={() =>
                        setSelectedOutcomeIndex(
                          index
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                        selectedOutcomeIndex ===
                        index
                          ? "border-white bg-white text-black"
                          : "border-zinc-800 bg-transparent text-white hover:bg-zinc-900"
                      }`}
                    >
                      <span>
                        {
                          outcome.label
                        }
                      </span>

                      <span>
                        {outcome.probability.toFixed(
                          1
                        )}
                        %
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm text-zinc-500">
                Deposit Amount
              </label>

              <div className="flex items-center rounded-2xl border border-zinc-800 bg-black px-5 py-4">
                <input
                  value={amount}
                  onChange={(
                    event
                  ) =>
                    setAmount(
                      event.target
                        .value
                    )
                  }
                  className="w-full bg-transparent text-white outline-none"
                />

                <span className="text-sm text-zinc-500">
                  USDC
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-900 bg-black p-5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  Flow
                </span>

                <span>
                  Collateral →
                  Vault →
                  Position Mint
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-zinc-500">
                  Vault
                </span>

                <span className="truncate pl-4 text-right">
                  {
                    process.env
                      .NEXT_PUBLIC_SETTLEMENT_VAULT_ADDRESS
                  }
                </span>
              </div>
            </div>

            <button
              disabled={
                isPending ||
                isConfirming ||
                !canTrade
              }
              onClick={() => {
                if (
                  !canTrade ||
                  !selectedOutcome
                )
                  return

                const numericAmount =
                  Number(amount)

                if (
                  Number.isNaN(
                    numericAmount
                  ) ||
                  numericAmount <=
                    0
                ) {
                  toast.error(
                    "Invalid deposit amount"
                  )

                  return
                }

                const probability =
                  selectedOutcome.probability <=
                  0
                    ? 1
                    : selectedOutcome.probability /
                      100

                const shares =
                  numericAmount /
                  probability

                const amountRaw =
                  parseUnits(
                    amount,
                    6
                  )

                const sharesRaw =
                  parseUnits(
                    shares.toString(),
                      6
                    
                  )

                setPendingTrade({
                  outcomeId:
                    selectedOutcome.id,

                  outcomeOnchainId:
                    selectedOutcome.onchainId as number,

                  amount:
                    numericAmount,

                  amountRaw,

                  sharesRaw,
                })

                setPhase("approve")

                const approvingToast =
                  toast.loading(
                    "Approving USDC..."
                  )

                setToastId(
                  approvingToast
                )

                writeContract({
                  address:
                    ARC_USDC_ERC20,

                  abi: erc20Abi,

                  functionName:
                    "approve",

                  args: [
                    settlementVaultConfig.address,
                    amountRaw,
                  ],
                })
              }}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {isPending
                ? "Waiting for wallet..."
                : isConfirming
                  ? phase ===
                    "approve"
                    ? "Authorizing Collateral..."
                    : "Allocating Position..."
                  : canTrade
                    ? "Confirm Allocation"
                    : "Connect wallet"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}