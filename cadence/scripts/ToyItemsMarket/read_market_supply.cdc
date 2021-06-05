import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"
import ToyItemsMarket from "../../contracts/ToyItemsMarket.cdc"

pub struct ToyItemStruct {
    pub let itemID: UInt64
    pub let typeID: UInt64
    pub let author: Address
    pub let metadata: String
    pub let price: UFix64

    init(itemID: UInt64, typeID: UInt64, author: Address, metadata: String, price: UFix64) {
        self.itemID = itemID
        self.typeID = typeID
        self.author = author
        self.metadata = metadata
        self.price = price
    }
}

pub fun main(): [ToyItemStruct] {
    let items : [ToyItemStruct] = []
    let totalSupply = ToyItemsMarket.totalSupply
    
    for address in totalSupply.keys {
        let account = getAccount(address)

        let marketCollectionRef = account
            .getCapability<&ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}>(
                ToyItemsMarket.CollectionPublicPath
            )
            .borrow()?? panic("Could not borrow market collection from market address")

        let toyItemCollectionRef = account.getCapability(ToyItems.CollectionPublicPath)!
            .borrow<&{ToyItems.ToyItemsCollectionPublic}>()
            ?? panic("Could not borrow ToyItemsCollectionPublic")

        let saleOffers = marketCollectionRef.borrowSaleOffers()
        for key in saleOffers.keys {
            let toyItem = toyItemCollectionRef.borrowToyItem(id: key)
                ?? panic("No such itemID in that collection")

            items.append(ToyItemStruct(
                itemID: saleOffers[key]!!.itemID, 
                typeID: toyItem.typeID,
                author: toyItem.author,
                metadata: toyItem.metadata,
                price: saleOffers[key]!!.price))
        }
    }
    
    return items
}
