import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import ToyItemsMarket from 0xToyItemsMarket

  transaction(itemID: UInt64) {
      prepare(account: AuthAccount) {
          let listing <- account
            .borrow<&ToyItemsMarket.Collection>(from: ToyItemsMarket.CollectionStoragePath)!
            .remove(itemID: itemID)
          destroy listing
      }
  }
`

// prettier-ignore
export function cancelMarketListing({ itemID }, opts = {}) {
  invariant(itemID != null, "cancelMarketListing({itemID}) -- itemID required")

  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemID), t.UInt64),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ], opts)
}
