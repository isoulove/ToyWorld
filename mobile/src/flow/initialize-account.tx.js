// prettier-ignore
import {transaction, limit, proposer, payer, authorizations, authz, cdc} from "@onflow/fcl"
import {invariant} from "@onflow/util-invariant"
import {tx} from "./util/tx"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import ToyNonFungibleToken from 0xToyNonFungibleToken
  import ToyCoin from 0xToyCoin
  import ToyItems from 0xToyItems
  import ToyItemsMarket from 0xToyItemsMarket

  pub fun hasToyCoin(_ address: Address): Bool {
    let receiver = getAccount(address)
      .getCapability<&ToyCoin.Vault{FungibleToken.Receiver}>(ToyCoin.ReceiverPublicPath)
      .check()

    let balance = getAccount(address)
      .getCapability<&ToyCoin.Vault{FungibleToken.Balance}>(ToyCoin.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasToyItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&ToyItems.Collection{ToyNonFungibleToken.CollectionPublic, ToyItems.ToyItemsCollectionPublic}>(ToyItems.CollectionPublicPath)
      .check()
  }

  pub fun hasMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}>(ToyItemsMarket.CollectionPublicPath)
      .check()
  }

  transaction {
    prepare(acct: AuthAccount) {
      if !hasToyCoin(acct.address) {
        if acct.borrow<&ToyCoin.Vault>(from: ToyCoin.VaultStoragePath) == nil {
          acct.save(<-ToyCoin.createEmptyVault(), to: ToyCoin.VaultStoragePath)
        }
        acct.unlink(ToyCoin.ReceiverPublicPath)
        acct.unlink(ToyCoin.BalancePublicPath)
        acct.link<&ToyCoin.Vault{FungibleToken.Receiver}>(ToyCoin.ReceiverPublicPath, target: ToyCoin.VaultStoragePath)
        acct.link<&ToyCoin.Vault{FungibleToken.Balance}>(ToyCoin.BalancePublicPath, target: ToyCoin.VaultStoragePath)
      }

      if !hasToyItems(acct.address) {
        if acct.borrow<&ToyItems.Collection>(from: ToyItems.CollectionStoragePath) == nil {
          acct.save(<-ToyItems.createEmptyCollection(), to: ToyItems.CollectionStoragePath)
        }
        acct.unlink(ToyItems.CollectionPublicPath)
        acct.link<&ToyItems.Collection{ToyNonFungibleToken.CollectionPublic, ToyItems.ToyItemsCollectionPublic}>(ToyItems.CollectionPublicPath, target: ToyItems.CollectionStoragePath)
      }

      if !hasMarket(acct.address) {
        if acct.borrow<&ToyItemsMarket.Collection>(from: ToyItemsMarket.CollectionStoragePath) == nil {
          acct.save(<-ToyItemsMarket.createEmptyCollection(), to: ToyItemsMarket.CollectionStoragePath)
        }
        acct.unlink(ToyItemsMarket.CollectionPublicPath)
        acct.link<&ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}>(ToyItemsMarket.CollectionPublicPath, target:ToyItemsMarket.CollectionStoragePath)
      }
    }
  }
`

export async function initializeAccount(address, opts = {}) {
  // prettier-ignore
  invariant(address != null, "Tried to initialize an account but no address was supplied")
  return tx(
    [
      transaction(CODE),
      limit(70),
      proposer(authz),
      payer(window.flowSer.authorizeMinter()),
      authorizations([authz]),
    ],
    opts
  )
}
