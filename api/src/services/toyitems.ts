import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import { FileService } from "./file";
import * as fs from "fs";
import * as path from "path";
import { response } from "express";

const nonFungibleTokenPath = '"../../contracts/ToyNonFungibleToken.cdc"';
const toyItemsPath = '"../../contracts/ToyItems.cdc"';

class ToyItemsService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fileService: FileService,
    private readonly nonFungibleTokenAddress: string,
    private readonly toyItemsAddress: string
  ) {}

  // 初始化存储
  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ToyItems/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  // 铸造NFT
  mint = async (recipient: string, metadata: object, typeID: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ToyItems/mint_toy_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));
      // if(metadata["fileObjects"][0].data&&metadata["fileObjects"][0].data.length>0){
      //   let rtObj = this.fileService.setUploadImg(metadata["fileObjects"][0].data);
      //   if (rtObj.code=="100") {
      //     delete metadata["fileObjects"]
      //     metadata["ipfs"] = rtObj.url;
      //   }
      // }else{
      //   delete metadata["fileObjects"]
      //   metadata["ipfs"] = "";
      // }
      
      return this.flowService.sendTx({
        transaction,
        args: [fcl.arg(recipient, t.Address), fcl.arg(typeID, t.UInt64), fcl.arg(JSON.stringify(metadata), t.String)],
        authorizations: [authorization],
        payer: authorization,
        proposer: authorization,
      });
  };

  // NFT转移
  transfer = async (recipient: string, itemID: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ToyItems/transfer_kitty_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(itemID, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  // 根据ID读取NFT对象
  getToyItem = async (account: string, id: number): Promise<Object> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/ToyItems/read_toy_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));

    return this.flowService.executeScript<Object>({
      script,
      args: [fcl.arg(account, t.Address), fcl.arg(id, t.UInt64)],
    });
  };

  // 根据ID读取NFT元数据
  getMetadata = async (account: string, id: number): Promise<String> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/ToyItems/read_metadata.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));

    return this.flowService.executeScript<String>({
      script,
      args: [fcl.arg(account, t.Address), fcl.arg(id, t.UInt64)],
    });
  };

  // 根据账户读取NFT的ID集合
  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/toyItems/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  // 根据账户读取NFT集合
  getToyItems = async (account: string): Promise<Object> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/ToyItems/read_toy_items.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));

    return this.flowService.executeScript<Object>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  // 更新NFT对象的metadata
  updMetadata = async (account: string, id: number,metadata: string) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ToyItems/update_item.cdc`
        ),
        "utf8"
      )
      .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
      .replace(toyItemsPath, fcl.withPrefix(this.toyItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(account, t.Address), fcl.arg(id, t.UInt64), fcl.arg(metadata, t.String)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };
}

export { ToyItemsService };