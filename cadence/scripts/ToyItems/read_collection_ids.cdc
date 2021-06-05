import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"

// This script returns an array of all the NFT IDs in an account's collection.

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(ToyItems.CollectionPublicPath)!.borrow<&{ToyNonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs()
}
