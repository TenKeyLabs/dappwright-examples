// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal contract behind the dApp's "Call Contract" button. `increase` is the cheapest
/// thing that still requires the wallet to sign and submit a transaction.
contract Counter {
    uint256 public count;

    function increase() public {
        count += 1;
    }
}
