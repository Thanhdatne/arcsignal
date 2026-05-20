const hre = require("hardhat")

async function main() {
  const sharesAddress =
    process.env
      .NEXT_PUBLIC_CONDITIONAL_SHARES_ADDRESS

  const vaultAddress =
    process.env
      .NEXT_PUBLIC_SETTLEMENT_VAULT_ADDRESS

  if (!sharesAddress) {
    throw new Error(
      "Missing NEXT_PUBLIC_CONDITIONAL_SHARES_ADDRESS"
    )
  }

  if (!vaultAddress) {
    throw new Error(
      "Missing NEXT_PUBLIC_SETTLEMENT_VAULT_ADDRESS"
    )
  }

  const shares =
    await hre.ethers.getContractAt(
      "ConditionalShares1155",
      sharesAddress
    )

  const tx =
    await shares.transferOwnership(
      vaultAddress
    )

  await tx.wait()

  console.log(
    "Ownership transferred to vault:"
  )

  console.log(vaultAddress)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})