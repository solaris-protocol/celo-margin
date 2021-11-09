/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { UbeswapBase, UbeswapBaseInterface } from "../UbeswapBase";

const _abi = [
  {
    inputs: [],
    name: "UBESWAP_ROUTER",
    outputs: [
      {
        internalType: "contract IUniswapV2Router02",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class UbeswapBase__factory {
  static readonly abi = _abi;
  static createInterface(): UbeswapBaseInterface {
    return new utils.Interface(_abi) as UbeswapBaseInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UbeswapBase {
    return new Contract(address, _abi, signerOrProvider) as UbeswapBase;
  }
}