import express, { Request, Response, Router } from "express";
import { ToyItemsService } from "../services/toyitems";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initToyItemsRouter(toyItemsService: ToyItemsService): Router {
  const router = express.Router();

  // 初始化存储-API（仅后端测试，实际需前端签名授权）
  router.post("/toy-items/setup", async (req: Request, res: Response) => {
    const transaction = await toyItemsService.setupAccount();
    return res.send({
      transaction,
    });
  });

  // 铸造NFT-API
  router.post(
    "/toy-items/mint",
    [body("recipient").exists(), body("typeID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, metadata, typeID } = req.body;
      const tx = await toyItemsService.mint(recipient, metadata, typeID);
      console.log(tx);
      return res.send({
        transaction: tx,
      });
    }
  );

  // NFT转移-API
  router.post(
    "/toy-items/transfer",
    [body("recipient").exists(), body("itemID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemID } = req.body;
      const tx = await toyItemsService.transfer(recipient, itemID);
      return res.send({
        transaction: tx,
      });
    }
  );

  // 根据ID读取NFT对象-API
  router.get(
    "/toy-items/item/:address/:itemId",
    async (req: Request, res: Response) => {
      const item = await toyItemsService.getToyItem(
        req.params.address,
        parseInt(req.params.itemId)
      );
      return res.send({
        item,
      });
    }
  );


  // 根据ID读取NFT元数据-API
  router.get(
    "/toy-items/metadata/:address/:itemId",
    async (req: Request, res: Response) => {
      const metadata = await toyItemsService.getMetadata(
        req.params.address,
        parseInt(req.params.itemId)
      );
      return res.send({
        metadata,
      });
    }
  );

  // 根据账户读取NFT的ID集合-API
  router.get(
    "/toy-items/ids/:account",
    async (req: Request, res: Response) => {
      const collection = await toyItemsService.getCollectionIds(
        req.params.account
      );
      return res.send({
        collection,
      });
    }
  );

  // 根据账户读取NFT集合-API
  router.get(
    "/toy-items/items/:address",
    async (req: Request, res: Response) => {
      const items = await toyItemsService.getToyItems(
        req.params.address
      );
      return res.send({
        items,
      });
    }
  );

  // 更新NFT元数据-API（仅后端测试用，实际需前端签名）
  router.post(
    "/toy-items/updmetadata",
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemID, metadata } = req.body;
      const rtMsg = await toyItemsService.updMetadata(recipient, itemID, metadata);
      
      console.log(rtMsg);
      
      return res.send({
        rtMsg,
      });
    }
  );

  return router;
}

export default initToyItemsRouter;
