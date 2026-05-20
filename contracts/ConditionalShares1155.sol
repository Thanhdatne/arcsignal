// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConditionalShares1155 is ERC1155, Ownable {
    mapping(uint256 => bool) public validPosition;

    constructor()
        ERC1155("https://arcsignal.io/api/token/{id}.json")
    {
        transferOwnership(msg.sender);
    }

    function tokenId(
        uint256 marketId,
        uint256 outcomeId
    ) public pure returns (uint256) {
        return (marketId * 1_000_000) + outcomeId;
    }

    function mintPosition(
        address user,
        uint256 marketId,
        uint256 outcomeId,
        uint256 amount
    ) external onlyOwner {
        uint256 id = tokenId(
            marketId,
            outcomeId
        );

        validPosition[id] = true;

        _mint(
            user,
            id,
            amount,
            ""
        );
    }

    function burnPosition(
        address user,
        uint256 marketId,
        uint256 outcomeId,
        uint256 amount
    ) external onlyOwner {
        uint256 id = tokenId(
            marketId,
            outcomeId
        );

        require(
            validPosition[id],
            "INVALID_POSITION"
        );

        _burn(
            user,
            id,
            amount
        );
    }
}