import {config} from "@onflow/fcl"

config()
  .put("env", process.env.REACT_APP_CHAIN_ENV)
  .put("accessNode.api", process.env.REACT_APP_ACCESS_NODE)
  .put("challenge.handshake", process.env.REACT_APP_WALLET_DISCOVERY)
  .put("0xFungibleToken", process.env.REACT_APP_CONTRACT_FUNGIBLE_TOKEN)
  .put("0xToyNonFungibleToken", process.env.REACT_APP_CONTRACT_NON_FUNGIBLE_TOKEN)
  .put("0xToyCoin", process.env.REACT_APP_CONTRACT_TOYCOIN)
  .put("0xToyItemsMarket", process.env.REACT_APP_CONTRACT_TOY_ITEMS_MARKET)
  .put("0xToyItems", process.env.REACT_APP_CONTRACT_TOY_ITEMS)
  .put("0xTTTTTTT", process.env.MINTER_ADDRESS)