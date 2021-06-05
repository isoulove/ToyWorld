import FungibleToken from "../../contracts/FungibleToken.cdc"
import ToyNonFungibleToken from "../../contracts/ToyNonFungibleToken.cdc"
import ToyCoin from "../../contracts/ToyCoin.cdc"
import ToyItems from "../../contracts/ToyItems.cdc"
import ToyItemsMarket from "../../contracts/ToyItemsMarket.cdc"

transaction(itemID: UInt64, marketCollectionAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let ToyItemsCollection: &ToyItems.Collection{ToyNonFungibleToken.Receiver}
    let marketCollection: &ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}

    prepare(signer: AuthAccount) {
        self.marketCollection = getAccount(marketCollectionAddress)
            .getCapability<&ToyItemsMarket.Collection{ToyItemsMarket.CollectionPublic}>(
                ToyItemsMarket.CollectionPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow market collection from market address")

        let saleItem = self.marketCollection.borrowSaleItem(itemID: itemID)
                    ?? panic("No item with that ID")
        let price = saleItem.price

        let mainToyCoinVault = signer.borrow<&ToyCoin.Vault>(from: ToyCoin.VaultStoragePath)
            ?? panic("Cannot borrow ToyCoin vault from acct storage")
        self.paymentVault <- mainToyCoinVault.withdraw(amount: price)

        self.ToyItemsCollection = signer.borrow<&ToyItems.Collection{ToyNonFungibleToken.Receiver}>(
            from: ToyItems.CollectionStoragePath
        ) ?? panic("Cannot borrow ToyItems collection receiver from acct")
    }

    execute {
        self.marketCollection.purchase(
            itemID: itemID,
            buyerCollection: self.ToyItemsCollection,
            buyerPayment: <- self.paymentVault
        )
    }
}
