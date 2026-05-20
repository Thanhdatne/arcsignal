export const scenarioMarketAbi = [
  {
    type: "function",
    name: "createMarket",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "addOutcome",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "label", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "resolveMarket",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "winningOutcomeId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claimRewards",
    stateMutability: "nonpayable",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [],
  },
] as const

export const scenarioMarketConfig = {
  address: process.env
    .NEXT_PUBLIC_SCENARIO_MARKET_ADDRESS as `0x${string}`,
  abi: scenarioMarketAbi,
} as const

export const settlementVaultAbi = [
  {
    type: "function",
    name: "vaultBalance",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "marketReserves",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcomeId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "shares", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcomeId", type: "uint256" },
      { name: "sharesAmount", type: "uint256" },
      { name: "payoutAmount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "finalizeMarket",
    stateMutability: "nonpayable",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "payout",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const

export const settlementVaultConfig = {
  address: process.env
    .NEXT_PUBLIC_SETTLEMENT_VAULT_ADDRESS as `0x${string}`,
  abi: settlementVaultAbi,
} as const

export const conditionalSharesAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenId",
    stateMutability: "pure",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcomeId", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

export const conditionalSharesConfig = {
  address: process.env
    .NEXT_PUBLIC_CONDITIONAL_SHARES_ADDRESS as `0x${string}`,
  abi: conditionalSharesAbi,
} as const