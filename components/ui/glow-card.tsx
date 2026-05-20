"use client"

import { ReactNode, useState } from "react"

type GlowCardProps = {
  children: ReactNode
  className?: string
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()

        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      }}
      className={`group relative overflow-hidden rounded-3xl border border-white/8 bg-zinc-950 p-8 transition duration-300 ease-out hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-[0_0_50px_rgba(52,211,153,0.09)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(520px circle at ${position.x}px ${position.y}px, rgba(52,211,153,0.13), transparent 42%)`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(52,211,153,0.035),rgba(255,255,255,0.015),transparent)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10">{children}</div>
    </div>
  )
}