import express, { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { MarketService } from "../services/market";

function initMarketRouter(marketService: MarketService): Router {
  const router = express.Router();

  // 初始化存储-API
  router.post("/market/setup", async (req: Request, res: Response) => {
    const tx = await marketService.setupAccount();
    return res.send({
      transactionId: tx,
    });
  });

  // 从交易市场购买NFT-API
  router.post(
    "/market/buy",
    [body("account").exists(), body("itemID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { account, itemID } = req.body;
      const tx = await marketService.buy(account, itemID);
      return res.send({
        transactionId: tx,
      });
    }
  );

  // 发布NFT到交易市场-API
  router.post(
    "/market/sell",
    [body("itemID").isInt(), body("price").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { itemID, price } = req.body;
      const tx = await marketService.sell(itemID, price);
      return res.send({
        transactionId: tx,
      });
    }
  );

  // 读取交易市场的NFT集合-API
  router.get(
    "/market/collection",
    async (req: Request, res: Response) => {
      const items = await marketService.getItems();
      return res.send({
        items,
      });
    }
  );

  return router;
}

export default initMarketRouter;
