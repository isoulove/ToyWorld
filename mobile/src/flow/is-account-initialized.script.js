import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import ToyNonFungibleToken from 0xToyNonFungibleToken
  import ToyCoin from 0xToyCoin
  import ToyItems from 0xToyItems
  import ToyItemsMarket from 0xToyItemsMarket

  pub fun hasToyCoin(_ address: Address): Bool {
    let receiver: Bool = getAccount(address)
      .getCapability<&ToyCoin.Vault{FungibleToken.Receiver}>(ToyCoin.ReceiverPublicPath)
      .check()

    let balance: Bool = getAccount(address)
      .getCapability<&ToyCoin.Vault{FungibleToken.Balance}>(ToyCoin.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasToyItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&ToyItems.Collection{ToyNonFungibleToken.CollectionPublic, ToyItems.ToyItemsCollectionPublic}>(ToyItems.CollectionPublicPath)
      .check()
  }

  pub fun hasToyItemsMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}>(ToyItemsMarket.CollectionPublicPath)
      .check()
  }

  pub fun main(address: Address): {String: Bool} {
    let ret: {String: Bool} = {}
    ret["ToyCoin"] = hasToyCoin(address)
    ret["ToyItems"] = hasToyItems(address)
    ret["ToyItemsMarket"] = hasToyItemsMarket(address)
    return ret
  }
`

export function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
