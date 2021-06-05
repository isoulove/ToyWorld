import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"

transaction(author: Address, typeID: UInt64, metadata: String) {
  let minterRef: &ToyItems.NFTMinter

  prepare(acct: AuthAccount) {  
      self.minterRef = acct.borrow<&ToyItems.NFTMinter>(from: ToyItems.MinterStoragePath)
          ?? panic("could not borrow minter reference")
  }

  execute {
      let recipient = getAccount(author)
      let receiverRef = recipient.getCapability(ToyItems.CollectionPublicPath)!
          .borrow<&{ToyNonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow receiver reference")

      self.minterRef.mintNFT(author: author, typeID: typeID, metadata: metadata)

      log("NFT Minted and deposited to Account Collection")
  }
}