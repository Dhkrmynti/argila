// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ArgilaToken
 * @notice The $ARGL reward token. The whole supply is minted once to the
 *         deployer at construction; there is no mint function, so no one
 *         (owner included) can ever create more.
 */
contract ArgilaToken is ERC20 {
    uint256 public constant TOTAL_SUPPLY = 10_000_000 * 10 ** 18;

    constructor() ERC20("Argila", "ARGL") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}
