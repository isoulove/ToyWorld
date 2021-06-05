import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"

// This transaction configures an account to hold Toy Items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&ToyItems.Collection>(from: ToyItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- ToyItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: ToyItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&ToyItems.Collection{ToyNonFungibleToken.CollectionPublic, ToyItems.ToyItemsCollectionPublic}>(ToyItems.CollectionPublicPath, target: ToyItems.CollectionStoragePath)
        }
    }
}
