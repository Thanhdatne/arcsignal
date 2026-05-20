const hre = require("hardhat")

async function main() {
  const ScenarioMarket =
    await hre.ethers.getContractFactory(
      "ScenarioMarket"
    )

  const market =
    await ScenarioMarket.deploy()

  await market.waitForDeployment()

  console.log(
    "ScenarioMarket deployed to:",
    await market.getAddress()
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})