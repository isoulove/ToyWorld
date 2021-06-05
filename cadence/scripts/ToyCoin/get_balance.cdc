import ToyCoin from "../../contracts/ToyCoin.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"

// This script returns an account's ToyCoin balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(ToyCoin.BalancePublicPath)!.borrow<&ToyCoin.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
