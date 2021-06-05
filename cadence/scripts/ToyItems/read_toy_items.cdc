import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"

// 读取元数据

pub struct ToyItemStruct {
    pub let itemID: UInt64
    pub let typeID: UInt64
    pub let author: Address
    pub let metadata: String

    init(itemID: UInt64, typeID: UInt64, author: Address, metadata: String) {
        self.itemID = itemID
        self.typeID = typeID
        self.author = author
        self.metadata = metadata
    }
}

pub fun main(address: Address): [ToyItemStruct]{
    let items : [ToyItemStruct] = []
    let account = getAccount(address)

    let collectionBorrow = account.getCapability(ToyItems.CollectionPublicPath)!
        .borrow<&{ToyItems.ToyItemsCollectionPublic}>()
        ?? panic("Could not borrow ToyItemsCollectionPublic")

    // borrow a reference to a specific NFT in the collection
    let bOwnedNFTs = collectionBorrow.borrowOwnedNFTs()

    for key in bOwnedNFTs.keys {
        items.append(ToyItemStruct(
            itemID: bOwnedNFTs[key]!!.id, 
            typeID: bOwnedNFTs[key]!!.typeID,
            author: bOwnedNFTs[key]!!.author,
            metadata: bOwnedNFTs[key]!!.metadata))
    }

    return items
}