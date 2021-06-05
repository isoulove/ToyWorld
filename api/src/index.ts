import * as fcl from "@onflow/fcl";

import Knex from "knex";

import initApp from "./app";
import { getConfig } from "./config";
import { FileService } from "./services/file";
import { FlowService } from "./services/flow";
import { ToyItemsService } from "./services/toyitems";
import { ToyCoinService } from "./services/toycoin";
import { MarketService } from "./services/market";

let knexInstance: Knex;

async function run() {
  const config = getConfig();

  knexInstance = Knex({
    client: "postgresql",
    connection: config.databaseUrl,
    migrations: {
      directory: config.databaseMigrationPath,
    },
  });

  // Make sure to disconnect from DB when exiting the process
  process.on("SIGTERM", () => {
    knexInstance.destroy().then(() => {
      process.exit(0);
    });
  });

  // Run all database migrations
  await knexInstance.migrate.latest();

  // Make sure we're pointing to the correct Flow Access API.
  fcl.config().put("accessNode.api", config.accessApi);

  const flowService = new FlowService(
    config.minterAddress,
    config.minterPrivateKeyHex,
    config.minterAccountKeyIndex
  );

  const fileService = new FileService();

  const toyCoinService = new ToyCoinService(
    flowService,
    config.fungibleTokenAddress,
    config.minterAddress
  );

  const toyItemsService = new ToyItemsService(
    flowService,
    fileService,
    config.nonFungibleTokenAddress,
    config.minterAddress
  );

  const marketService = new MarketService(
    flowService,
    config.fungibleTokenAddress,
    config.minterAddress,
    config.nonFungibleTokenAddress,
    config.minterAddress,
    config.minterAddress
  );

  const app = initApp(
    knexInstance,
    toyCoinService,
    toyItemsService,
    marketService
  );

  app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
  });
}

const redOutput = "\x1b[31m%s\x1b[0m";

run().catch((e) => {
  console.error(redOutput, e);
  process.exit(1);
});
