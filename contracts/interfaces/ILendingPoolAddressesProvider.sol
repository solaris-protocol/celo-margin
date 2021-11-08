// SPDX-License-Identifier: ISC

pragma solidity ^0.8.0;

interface ILendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);
}
