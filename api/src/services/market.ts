import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import * as fs from "fs";
import * as path from "path";

import { FlowService } from "../services/flow";
import { response } from "express";

const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"';
const nonFungibleTokenPath = '"../../contracts/ToyNonFungibleToken.cdc"';
const toyCoinPath = '"../../contracts/ToyCoin.cdc"';
const toyItemsPath = '"../../contracts/ToyItems.cdc"';
const toyItemsMarketPath = '"../../contracts/ToyItemsMarket.cdc"';

class MarketService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly toyCoinAddress: string,
    private readonly nonFungibleTokenAddress: string,
    private readonly toyItemsAddress: string,
    public readonly marketAddress: string
  ) {}

  // 初始化存储
  setupAccount = () => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ToyItemsMarket/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(toyItemsMarketPath, fcl.withPrefix(this.marketAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  // getItem = (account: string, itemID: number) => {
  //   const script = fs
  //     .readFileSync(
  //       path.join(
  //         __dirname,
  //         `../../../cadence/cadence/ToyItemsMarket/scripts/read_collection_ids.cdc`
  //       ),
  //       "utf8"
  //     )
  //     .replace(toyItemsMarkPath, fcl.withPrefix(this.marketAddress));

  //   return this.flowService.executeScript<any[]>({
  //     script,
  //     args: [fcl.arg(account, t.Address), fcl.arg(itemID, t.UInt64)],
  //   });
  // };

  // 读取交易市场的NFT集合
  getItems = async (): Promise<Object[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/ToyItemsMarket/read_market_supply.cdc`
        ),
        "utf8"
      )
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress))
      .replace(toyItemsMarketPath, fcl.withPrefix(this.marketAddress));

    return this.flowService.executeScript<Object[]>({
      script,
      args: [],
    });
  };

  // 从交易市场购买NFT
  buy = (account: string, itemID: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ToyItemsMarket/buy_market_item.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyCoinPath, fcl.withPrefix(this.toyCoinAddress))
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress))
      .replace(toyItemsMarketPath, fcl.withPrefix(this.marketAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(itemID, t.UInt64), fcl.arg(account, t.Address)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  // 发布NFT到交易市场
  sell = (itemID: number, price: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ToyItemsMarket/sell_market_item.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyCoinPath, fcl.withPrefix(this.toyCoinAddress))
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress))
      .replace(toyItemsMarketPath, fcl.withPrefix(this.marketAddress));

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(itemID, t.UInt64),
        fcl.arg(price.toFixed(8).toString(), t.UFix64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };
}

export { MarketService };
