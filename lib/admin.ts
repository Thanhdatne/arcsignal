export function isAdminWallet(wallet?: string | null) {
  if (!wallet) return false

  return (
    wallet.toLowerCase() ===
    process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()
  )
}