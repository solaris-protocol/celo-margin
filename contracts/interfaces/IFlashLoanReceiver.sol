// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

import { ILendingPoolAddressesProvider } from "./ILendingPoolAddressesProvider.sol";
import { ILendingPool } from "./ILendingPool.sol";

/**
 * @title IFlashLoanReceiver interface
 * @notice Interface for the Moola fee IFlashLoanReceiver.
 * @dev implement this interface to develop a flashloan-compatible flashLoanReceiver contract
 **/
interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);

    function ADDRESSES_PROVIDER() external view returns (ILendingPoolAddressesProvider);

    function LENDING_POOL() external view returns (ILendingPool);
}