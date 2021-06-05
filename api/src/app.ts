import "express-async-errors";
import express, { Request, Response } from "express";
import Knex from "knex";
import cors from "cors";
import { Model } from "objection";
import { json, urlencoded } from "body-parser";
import { ToyItemsService } from "./services/toyitems";
import { ToyCoinService } from "./services/toycoin";
import { MarketService } from "./services/market";
import initToyItemsRouter from "./routes/toyitems";
import initToyCoinRouter from "./routes/toycoin";
import initMarketRouter from "./routes/market";

const V1 = "/v1/";

// Init all routes, setup middlewares and dependencies
const initApp = (
  knex: Knex,
  toyCoinService: ToyCoinService,
  toyItemsService: ToyItemsService,
  marketService: MarketService
) => {
  Model.knex(knex);
  const app = express();

  // @ts-ignore
  app.use(cors());
  //app.use(json()); //next line will invalid if this line uncomment
  app.use(json({limit: "40mb"}));
  app.use(urlencoded({ limit:'40mb', extended: true }));
  app.use(V1, initToyItemsRouter(toyItemsService));
  app.use(V1, initToyCoinRouter(toyCoinService));
  app.use(V1, initMarketRouter(marketService));

  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
