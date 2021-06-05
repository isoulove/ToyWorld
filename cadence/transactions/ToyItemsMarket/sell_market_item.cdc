import FungibleToken from "../../contracts/FungibleToken.cdc"
import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyCoin from "../../contracts/ToyCoin.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"
import ToyItemsMarket from "../../contracts/ToyItemsMarket.cdc"

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
