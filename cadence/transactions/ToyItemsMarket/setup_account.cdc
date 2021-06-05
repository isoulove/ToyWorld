import ToyItemsMarket from "../../contracts/ToyItemsMarket.cdc"

// This transaction configures an account to hold SaleOffer items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&ToyItemsMarket.Collection>(from: ToyItemsMarket.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- ToyItemsMarket.createEmptyCollection() as! @ToyItemsMarket.Collection
            
            // save it to the account
            signer.save(<-collection, to: ToyItemsMarket.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}>(ToyItemsMarket.CollectionPublicPath, target: ToyItemsMarket.CollectionStoragePath)
        }
    }
}
