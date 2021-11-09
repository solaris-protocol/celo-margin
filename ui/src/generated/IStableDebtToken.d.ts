/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IStableDebtTokenInterface extends ethers.utils.Interface {
  functions: {
    "approveDelegation(address,uint256)": FunctionFragment;
    "borrowAllowance(address,address)": FunctionFragment;
    "burn(address,uint256)": FunctionFragment;
    "getAverageStableRate()": FunctionFragment;
    "getSupplyData()": FunctionFragment;
    "getTotalSupplyAndAvgRate()": FunctionFragment;
    "getTotalSupplyLastUpdated()": FunctionFragment;
    "getUserLastUpdated(address)": FunctionFragment;
    "getUserStableRate(address)": FunctionFragment;
    "mint(address,address,uint256,uint256)": FunctionFragment;
    "principalBalanceOf(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approveDelegation",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "borrowAllowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAverageStableRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSupplyData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalSupplyAndAvgRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalSupplyLastUpdated",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUserLastUpdated",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserStableRate",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "principalBalanceOf",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveDelegation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "borrowAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAverageStableRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupplyData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalSupplyAndAvgRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalSupplyLastUpdated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserLastUpdated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserStableRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "principalBalanceOf",
    data: BytesLike
  ): Result;

  events: {
    "Burn(address,uint256,uint256,uint256,uint256,uint256)": EventFragment;
    "Mint(address,address,uint256,uint256,uint256,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Burn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Mint"): EventFragment;
}

export type BurnEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
    user: string;
    amount: BigNumber;
    currentBalance: BigNumber;
    balanceIncrease: BigNumber;
    avgStableRate: BigNumber;
    newTotalSupply: BigNumber;
  }
>;

export type MintEvent = TypedEvent<
  [
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    user: string;
    onBehalfOf: string;
    amount: BigNumber;
    currentBalance: BigNumber;
    balanceIncrease: BigNumber;
    newRate: BigNumber;
    avgStableRate: BigNumber;
    newTotalSupply: BigNumber;
  }
>;

export class IStableDebtToken extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IStableDebtTokenInterface;

  functions: {
    approveDelegation(
      delegatee: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    borrowAllowance(
      fromUser: string,
      toUser: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    burn(
      user: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAverageStableRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    getSupplyData(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber, number]>;

    getTotalSupplyAndAvgRate(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getTotalSupplyLastUpdated(overrides?: CallOverrides): Promise<[number]>;

    getUserLastUpdated(
      user: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getUserStableRate(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    mint(
      user: string,
      onBehalfOf: string,
      amount: BigNumberish,
      rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    principalBalanceOf(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  approveDelegation(
    delegatee: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  borrowAllowance(
    fromUser: string,
    toUser: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  burn(
    user: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAverageStableRate(overrides?: CallOverrides): Promise<BigNumber>;

  getSupplyData(
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber, number]>;

  getTotalSupplyAndAvgRate(
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  getTotalSupplyLastUpdated(overrides?: CallOverrides): Promise<number>;

  getUserLastUpdated(user: string, overrides?: CallOverrides): Promise<number>;

  getUserStableRate(
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  mint(
    user: string,
    onBehalfOf: string,
    amount: BigNumberish,
    rate: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  principalBalanceOf(
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    approveDelegation(
      delegatee: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    borrowAllowance(
      fromUser: string,
      toUser: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      user: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getAverageStableRate(overrides?: CallOverrides): Promise<BigNumber>;

    getSupplyData(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber, number]>;

    getTotalSupplyAndAvgRate(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getTotalSupplyLastUpdated(overrides?: CallOverrides): Promise<number>;

    getUserLastUpdated(
      user: string,
      overrides?: CallOverrides
    ): Promise<number>;

    getUserStableRate(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mint(
      user: string,
      onBehalfOf: string,
      amount: BigNumberish,
      rate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    principalBalanceOf(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "Burn(address,uint256,uint256,uint256,uint256,uint256)"(
      user?: string | null,
      amount?: null,
      currentBalance?: null,
      balanceIncrease?: null,
      avgStableRate?: null,
      newTotalSupply?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
      {
        user: string;
        amount: BigNumber;
        currentBalance: BigNumber;
        balanceIncrease: BigNumber;
        avgStableRate: BigNumber;
        newTotalSupply: BigNumber;
      }
    >;

    Burn(
      user?: string | null,
      amount?: null,
      currentBalance?: null,
      balanceIncrease?: null,
      avgStableRate?: null,
      newTotalSupply?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
      {
        user: string;
        amount: BigNumber;
        currentBalance: BigNumber;
        balanceIncrease: BigNumber;
        avgStableRate: BigNumber;
        newTotalSupply: BigNumber;
      }
    >;

    "Mint(address,address,uint256,uint256,uint256,uint256,uint256,uint256)"(
      user?: string | null,
      onBehalfOf?: string | null,
      amount?: null,
      currentBalance?: null,
      balanceIncrease?: null,
      newRate?: null,
      avgStableRate?: null,
      newTotalSupply?: null
    ): TypedEventFilter<
      [
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ],
      {
        user: string;
        onBehalfOf: string;
        amount: BigNumber;
        currentBalance: BigNumber;
        balanceIncrease: BigNumber;
        newRate: BigNumber;
        avgStableRate: BigNumber;
        newTotalSupply: BigNumber;
      }
    >;

    Mint(
      user?: string | null,
      onBehalfOf?: string | null,
      amount?: null,
      currentBalance?: null,
      balanceIncrease?: null,
      newRate?: null,
      avgStableRate?: null,
      newTotalSupply?: null
    ): TypedEventFilter<
      [
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ],
      {
        user: string;
        onBehalfOf: string;
        amount: BigNumber;
        currentBalance: BigNumber;
        balanceIncrease: BigNumber;
        newRate: BigNumber;
        avgStableRate: BigNumber;
        newTotalSupply: BigNumber;
      }
    >;
  };

  estimateGas: {
    approveDelegation(
      delegatee: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    borrowAllowance(
      fromUser: string,
      toUser: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      user: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAverageStableRate(overrides?: CallOverrides): Promise<BigNumber>;

    getSupplyData(overrides?: CallOverrides): Promise<BigNumber>;

    getTotalSupplyAndAvgRate(overrides?: CallOverrides): Promise<BigNumber>;

    getTotalSupplyLastUpdated(overrides?: CallOverrides): Promise<BigNumber>;

    getUserLastUpdated(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserStableRate(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mint(
      user: string,
      onBehalfOf: string,
      amount: BigNumberish,
      rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    principalBalanceOf(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveDelegation(
      delegatee: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    borrowAllowance(
      fromUser: string,
      toUser: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burn(
      user: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAverageStableRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupplyData(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTotalSupplyAndAvgRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalSupplyLastUpdated(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserLastUpdated(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserStableRate(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mint(
      user: string,
      onBehalfOf: string,
      amount: BigNumberish,
      rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    principalBalanceOf(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}