import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import ToyNonFungibleToken from 0xToyNonFungibleToken
  import ToyCoin from 0xToyCoin
  import ToyItems from 0xToyItems
  import ToyItemsMarket from 0xToyItemsMarket

  transaction(itemID: UInt64, marketCollectionAddress: Address) {
      let paymentVault: @FungibleToken.Vault
      let ToyItemsCollection: &ToyItems.Collection{ToyNonFungibleToken.Receiver}
      let marketCollection: &ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}

      prepare(acct: AuthAccount) {
          self.marketCollection = getAccount(marketCollectionAddress)
              .getCapability<&ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}>(ToyItemsMarket.CollectionPublicPath)
              .borrow() ?? panic("Could not borrow market collection from market address")

          let price = self.marketCollection.borrowSaleItem(itemID: itemID)!.price

          let mainToyCoinVault = acct.borrow<&ToyCoin.Vault>(from: ToyCoin.VaultStoragePath)
              ?? panic("Cannot borrow ToyCoin vault from acct storage")
          self.paymentVault <- mainToyCoinVault.withdraw(amount: price)

          self.ToyItemsCollection = acct.borrow<&ToyItems.Collection{ToyNonFungibleToken.Receiver}>(
              from: ToyItems.CollectionStoragePath
          ) ?? panic("Cannot borrow ToyItems collection receiver from acct")
      }

      execute {
          self.marketCollection.purchase(
              itemID: itemID,
              buyerCollection: self.ToyItemsCollection,
              buyerPayment: <- self.paymentVault
          )
      }
  }
`

// prettier-ignore
export function buyMarketItem({itemID, ownerAddress}, opts = {}) {
  invariant(itemID != null, "buyMarketItem({itemID, ownerAddress}) -- itemID required")
  invariant(ownerAddress != null, "buyMarketItem({itemID, ownerAddress}) -- ownerAddress required")

  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemID), t.UInt64),
      fcl.arg(String(ownerAddress), t.Address),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(window.flowSer.authorizeMinter()),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ], opts)
}
