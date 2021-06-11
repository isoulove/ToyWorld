import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import ToyNonFungibleToken from 0xToyNonFungibleToken
  import ToyCoin from 0xToyCoin
  import ToyItems from 0xToyItems
  import ToyItemsMarket from 0xToyItemsMarket

  transaction(itemID: UInt64, price: UFix64) {
    let ToyCoinVault: Capability<&ToyCoin.Vault{FungibleToken.Receiver}>
    let ToyItemsCollection: Capability<&ToyItems.Collection{ToyNonFungibleToken.Provider, ToyItems.ToyItemsCollectionPublic}>
    let marketCollection: &ToyItemsMarket.Collection

    prepare(signer: AuthAccount) {
        // we need a provider capability, but one is not provided by default so we create one.
        let ToyItemsCollectionProviderPrivatePath = /private/ToyItemsCollectionProvider

        self.ToyCoinVault = signer.getCapability<&ToyCoin.Vault{FungibleToken.Receiver}>(ToyCoin.ReceiverPublicPath)!
        assert(self.ToyCoinVault.borrow() != nil, message: "Missing or mis-typed ToyCoin receiver")

        if !signer.getCapability<&ToyItems.Collection{ToyNonFungibleToken.Provider, ToyItems.ToyItemsCollectionPublic}>(ToyItemsCollectionProviderPrivatePath)!.check() {
          signer.link<&ToyItems.Collection{ToyNonFungibleToken.Provider, ToyItems.ToyItemsCollectionPublic}>(ToyItemsCollectionProviderPrivatePath, target: ToyItems.CollectionStoragePath)
        } else {
          signer.unlink(ToyItemsCollectionProviderPrivatePath)
          signer.link<&ToyItems.Collection{ToyNonFungibleToken.Provider, ToyItems.ToyItemsCollectionPublic}>(ToyItemsCollectionProviderPrivatePath, target: ToyItems.CollectionStoragePath)
        }

        self.ToyItemsCollection = signer.getCapability<&ToyItems.Collection{ToyNonFungibleToken.Provider, ToyItems.ToyItemsCollectionPublic}>(ToyItemsCollectionProviderPrivatePath)!
        assert(self.ToyItemsCollection.borrow() != nil, message: "Missing or mis-typed ToyItemsCollection provider")

        self.marketCollection = signer.borrow<&ToyItemsMarket.Collection>(from: ToyItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed ToyItemsMarket Collection")
    }

    execute {
        let offer <- ToyItemsMarket.createSaleOffer (
            sellerItemProvider: self.ToyItemsCollection,
            sellerPaymentReceiver: self.ToyCoinVault,
            itemID: itemID,
            price: price
        )
        self.marketCollection.insert(offer: <-offer)
    }
  }
`

export function createSaleOffer({itemID, price}, opts = {}) {
  if (itemID == null)
    throw new Error("createSaleOffer(itemID, price) -- itemID required")
  if (price == null)
    throw new Error("createSaleOffer(itemID, price) -- price required")
  console.log(window.flowSer)
  // prettier-ignore
  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemID), t.UInt64),
      fcl.arg(String(price), t.UFix64),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(window.auth),
    fcl.authorizations([
      fcl.authz
    ]),
    fcl.limit(1000)
  ], opts)
}
