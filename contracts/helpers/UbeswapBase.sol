// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

import { IUniswapV2Router02 } from "../interfaces/IUniswapV2Router02.sol";

abstract contract UbeswapBase {
    IUniswapV2Router02 public immutable UBESWAP_ROUTER;

    constructor(IUniswapV2Router02 router) {
        UBESWAP_ROUTER = router;
    }
}
