// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IConditionalShares1155 {
    function mintPosition(address user, uint256 marketId, uint256 outcomeId, uint256 amount) external;
    function burnPosition(address user, uint256 marketId, uint256 outcomeId, uint256 amount) external;
}

contract SettlementVault {
    address public owner;
    IERC20 public immutable settlementAsset;
    IConditionalShares1155 public immutable conditionalShares;

    mapping(uint256 => uint256) public marketReserves;

    event Deposited(uint256 indexed marketId, uint256 indexed outcomeId, address indexed user, uint256 amount, uint256 shares);
    event Claimed(uint256 indexed marketId, uint256 indexed outcomeId, address indexed user, uint256 payoutAmount, uint256 sharesBurned);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor(address _settlementAsset, address _conditionalShares) {
        owner = msg.sender;
        settlementAsset = IERC20(_settlementAsset);
        conditionalShares = IConditionalShares1155(_conditionalShares);
    }

    function deposit(
        uint256 marketId,
        uint256 outcomeId,
        uint256 amount,
        uint256 shares
    ) external {
        require(amount > 0, "INVALID_AMOUNT");
        require(shares > 0, "INVALID_SHARES");

        bool success = settlementAsset.transferFrom(msg.sender, address(this), amount);
        require(success, "TRANSFER_FAILED");

        marketReserves[marketId] += amount;

        conditionalShares.mintPosition(msg.sender, marketId, outcomeId, shares);

        emit Deposited(marketId, outcomeId, msg.sender, amount, shares);
    }

    function claim(
        uint256 marketId,
        uint256 outcomeId,
        uint256 sharesAmount,
        uint256 payoutAmount
    ) external {
        require(sharesAmount > 0, "INVALID_SHARES");
        require(payoutAmount > 0, "INVALID_PAYOUT");
        require(marketReserves[marketId] >= payoutAmount, "INSUFFICIENT_RESERVE");

        conditionalShares.burnPosition(msg.sender, marketId, outcomeId, sharesAmount);

        marketReserves[marketId] -= payoutAmount;

        bool success = settlementAsset.transfer(msg.sender, payoutAmount);
        require(success, "PAYOUT_FAILED");

        emit Claimed(marketId, outcomeId, msg.sender, payoutAmount, sharesAmount);
    }

    function payout(uint256 marketId, address user, uint256 amount) external onlyOwner {
        require(marketReserves[marketId] >= amount, "INSUFFICIENT_RESERVE");

        marketReserves[marketId] -= amount;

        bool success = settlementAsset.transfer(user, amount);
        require(success, "PAYOUT_FAILED");
    }

    function vaultBalance() external view returns (uint256) {
        return settlementAsset.balanceOf(address(this));
    }
}