"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatUnits } from "viem"
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
} from "wagmi"

import { arcTestnet } from "@/lib/chains"

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/create", label: "Create" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/claims", label: "Claims" },
  { href: "/treasury", label: "Treasury" },
  { href: "/arc", label: "Arc" },
]

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [balance, setBalance] = useState("0.0000")

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const publicClient = usePublicClient({
    chainId: arcTestnet.id,
  })

  const injectedConnector = connectors[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function loadBalance() {
      if (!address || !publicClient) return

      const rawBalance = await publicClient.getBalance({
        address,
      })

      setBalance(
        Number(formatUnits(rawBalance, 18)).toFixed(4)
      )
    }

    loadBalance()

    const interval = setInterval(loadBalance, 5000)

    return () => clearInterval(interval)
  }, [address, publicClient])

  const adminWallet =
    process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()

  const isAdmin =
    mounted && address?.toLowerCase() === adminWallet

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/8 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          prefetch
          className="text-4xl font-semibold tracking-tight text-white transition hover:text-emerald-300"
        >
          ArcSignal
        </Link>

        <nav className="flex items-center gap-7 text-[15px] font-medium text-zinc-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className="group relative opacity-80 transition hover:opacity-100"
            >
              {link.label}

              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-emerald-300 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {isAdmin ? (
            <Link
              href="/admin"
              prefetch
              className="group relative opacity-80 transition hover:opacity-100"
            >
              Admin

              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-emerald-300 transition-all duration-300 group-hover:w-full" />
            </Link>
          ) : null}

          {!mounted ? (
            <div className="h-10 w-32 rounded-2xl border border-zinc-800" />
          ) : isConnected ? (
            <>
              <a
                href="https://faucet.circle.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-emerald-300/30 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-300 hover:text-black"
              >
                Faucet
              </a>

              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-300">
                {balance} USDC
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="rounded-2xl border border-zinc-800 px-4 py-2 text-sm text-white transition hover:border-emerald-300/40"
                >
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>

                {open ? (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
                    <div className="mb-3 rounded-xl bg-black p-3 text-xs text-zinc-500">
                      <p className="mb-1">
                        Connected wallet
                      </p>

                      <p className="break-all text-zinc-300">
                        {address}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        disconnect()
                        setOpen(false)
                      }}
                      className="w-full rounded-xl border border-zinc-800 px-4 py-3 text-sm text-white transition hover:border-white hover:bg-white hover:text-black"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <button
              onClick={() =>
                connect({
                  connector: injectedConnector,
                })
              }
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}