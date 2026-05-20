// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ScenarioMarket {
    address public owner;

    uint256 public nextMarketId;

    struct Market {
        bool exists;
        bool resolved;
        uint256 winningOutcomeId;
        uint256 outcomeCount;
    }

    mapping(uint256 => Market) public markets;

    mapping(uint256 => mapping(uint256 => string)) public outcomeLabels;

    event MarketCreated(uint256 indexed marketId);

    event OutcomeAdded(
        uint256 indexed marketId,
        uint256 indexed outcomeId,
        string label
    );

    event MarketResolved(
        uint256 indexed marketId,
        uint256 indexed winningOutcomeId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextMarketId = 1;
    }

    function createMarket() external onlyOwner returns (uint256) {
        uint256 marketId = nextMarketId;

        markets[marketId] = Market({
            exists: true,
            resolved: false,
            winningOutcomeId: 0,
            outcomeCount: 0
        });

        nextMarketId += 1;

        emit MarketCreated(marketId);

        return marketId;
    }

    function addOutcome(
        uint256 marketId,
        string calldata label
    ) external onlyOwner returns (uint256) {
        require(labelExists(label), "INVALID_LABEL");

        if (!markets[marketId].exists) {
            markets[marketId].exists = true;
        }

        require(!markets[marketId].resolved, "MARKET_RESOLVED");

        uint256 outcomeId = markets[marketId].outcomeCount + 1;

        markets[marketId].outcomeCount = outcomeId;
        outcomeLabels[marketId][outcomeId] = label;

        emit OutcomeAdded(marketId, outcomeId, label);

        return outcomeId;
    }

    function resolveMarket(
        uint256 marketId,
        uint256 winningOutcomeId
    ) external onlyOwner {
        require(winningOutcomeId > 0, "INVALID_OUTCOME");

        markets[marketId].exists = true;
        markets[marketId].resolved = true;
        markets[marketId].winningOutcomeId = winningOutcomeId;

        emit MarketResolved(marketId, winningOutcomeId);
    }

    function claimRewards(uint256 marketId) external view returns (bool) {
        require(markets[marketId].exists, "MARKET_NOT_FOUND");
        require(markets[marketId].resolved, "MARKET_NOT_RESOLVED");

        return true;
    }

    function labelExists(string calldata label) internal pure returns (bool) {
        return bytes(label).length > 0;
    }
}