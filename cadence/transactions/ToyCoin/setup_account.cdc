import FungibleToken from "../../contracts/FungibleToken.cdc"
import ToyCoin from "../../contracts/ToyCoin.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the ToyCoin

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&ToyCoin.Vault>(from: ToyCoin.VaultStoragePath) == nil {
            // Create a new ToyCoin Vault and put it in storage
            signer.save(<-ToyCoin.createEmptyVault(), to: ToyCoin.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&ToyCoin.Vault{FungibleToken.Receiver}>(
                ToyCoin.ReceiverPublicPath,
                target: ToyCoin.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&ToyCoin.Vault{FungibleToken.Balance}>(
                ToyCoin.BalancePublicPath,
                target: ToyCoin.VaultStoragePath
            )
        }
    }
}
