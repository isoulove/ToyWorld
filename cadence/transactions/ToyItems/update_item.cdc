import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"

transaction(address: Address, id: UInt64, metadata: String) {
    prepare(acct: AuthAccount) {  
        let collectionBorrow = acct.getCapability(ToyItems.CollectionPublicPath)!
            .borrow<&{ToyItems.ToyItemsCollectionPublic}>()
            ?? panic("Could not borrow ToyItemsCollectionPublic")

        collectionBorrow.updMetadata(id: id, metadata: metadata)
    }
}