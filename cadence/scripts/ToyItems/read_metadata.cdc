import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"

// 读取元数据

pub fun main(address: Address, id: UInt64): String {
    let account = getAccount(address)

    let collectionRef = account.getCapability(ToyItems.CollectionPublicPath)!.borrow<&{ToyItems.ToyItemsCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getMetadata(id: id)
}