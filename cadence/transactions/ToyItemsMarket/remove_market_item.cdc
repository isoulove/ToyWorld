import ToyItemsMarket from "../../contracts/ToyItemsMarket.cdc"

transaction(itemID: UInt64) {
    let marketCollection: &ToyItemsMarket.Collection

    prepare(signer: AuthAccount) {
        self.marketCollection = signer.borrow<&ToyItemsMarket.Collection>(from: ToyItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed ToyItemsMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(itemID: itemID)
        destroy offer
    }
}
