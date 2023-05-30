/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface LotterexContract extends Truffle.Contract<LotterexInstance> {
  "new"(
    _name: string,
    meta?: Truffle.TransactionDetails
  ): Promise<LotterexInstance>;
}

type AllEvents = never;

export interface LotterexInstance extends Truffle.ContractInstance {
  manager(txDetails?: Truffle.TransactionDetails): Promise<string>;

  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  getPlayers(txDetails?: Truffle.TransactionDetails): Promise<string[]>;

  getBalance(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  hasEntered(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  leave: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  pickWinner: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  methods: {
    manager(txDetails?: Truffle.TransactionDetails): Promise<string>;

    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    getPlayers(txDetails?: Truffle.TransactionDetails): Promise<string[]>;

    getBalance(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    hasEntered(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    leave: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    pickWinner: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
