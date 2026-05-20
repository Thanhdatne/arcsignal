const hre = require("hardhat")

async function main() {
  const usdcAddress = process.env.ARC_USDC_ADDRESS
  const sharesAddress =
    process.env.NEXT_PUBLIC_CONDITIONAL_SHARES_ADDRESS

  if (!usdcAddress) {
    throw new Error("Missing ARC_USDC_ADDRESS")
  }

  if (!sharesAddress) {
    throw new Error("Missing NEXT_PUBLIC_CONDITIONAL_SHARES_ADDRESS")
  }

  const SettlementVault =
    await hre.ethers.getContractFactory(
      "contracts/SettlementVault.sol:SettlementVault"
    )

  const vault = await SettlementVault.deploy(
    usdcAddress,
    sharesAddress
  )

  await vault.waitForDeployment()

  console.log(
    "SettlementVault deployed to:",
    await vault.getAddress()
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})