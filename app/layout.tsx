import type { Metadata } from "next"
import "./globals.css"

import { Toaster } from "sonner"

import { Navbar } from "@/components/layout/navbar"
import { Providers } from "@/components/providers/providers"
import { SignalField } from "@/components/background/signal-field"

export const metadata: Metadata = {
  title: "ArcSignal",
  description:
    "Institutional-grade multi-outcome prediction markets on Arc.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden bg-black text-white antialiased">
        <Providers>
          <div className="fixed inset-0 -z-20 bg-black" />

          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_42%)] animate-pulse" />

          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_38%)]" />

          <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,transparent,rgba(16,185,129,0.035),transparent)] animate-pulse" />

          <SignalField />

          <div className="relative z-10">
            <Navbar />
            {children}
          </div>

          <Toaster theme="dark" richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}