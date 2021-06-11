import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"

// 读取元数据

pub struct ToyItemStruct {
    pub let owner: Address
    pub let itemID: UInt64
    pub let typeID: UInt64
    pub let author: Address
    pub let metadata: String

    init(owner: Address, itemID: UInt64, typeID: UInt64, author: Address, metadata: String) {
        self.owner = owner
        self.itemID = itemID
        self.typeID = typeID
        self.author = author
        self.metadata = metadata
    }
}

pub fun main(address: Address, id: UInt64): ToyItemStruct{
    let account = getAccount(address)

    let collectionBorrow = account.getCapability(ToyItems.CollectionPublicPath)!
        .borrow<&{ToyItems.ToyItemsCollectionPublic}>()
        ?? panic("Could not borrow ToyItemsCollectionPublic")

    // borrow a reference to a specific NFT in the collection
    let toyItem = collectionBorrow.borrowToyItem(id: id)
        ?? panic("No such itemID in that collection")

    return ToyItemStruct(
        owner: address,
        itemID: toyItem.id, 
        typeID: toyItem.typeID,
        author: toyItem.author,
        metadata: toyItem.metadata)
}