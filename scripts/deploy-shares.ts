const hre = require("hardhat")

async function main() {
  const Shares =
    await hre.ethers.getContractFactory(
      "ConditionalShares1155"
    )

  const shares =
    await Shares.deploy()

  await shares.waitForDeployment()

  console.log(
    "ConditionalShares1155 deployed to:",
    await shares.getAddress()
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})