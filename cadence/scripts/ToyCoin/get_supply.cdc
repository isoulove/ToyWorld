import ToyCoin from "../../contracts/ToyCoin.cdc"

// This script returns the total amount of ToyCoin currently in existence.

pub fun main(): UFix64 {

    let supply = ToyCoin.totalSupply

    log(supply)

    return supply
}
