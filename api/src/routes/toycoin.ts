import express, { Request, Response, Router } from "express";
import { ToyCoinService } from "../services/toycoin";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initToyCoinRouter(ToyCoinService: ToyCoinService): Router {
  const router = express.Router();

  router.post(
    "/toycoin/mint",
    [body("recipient").exists(), body("amount").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;

      const transaction = await ToyCoinService.mint(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post("/toycoin/setup", async (req: Request, res: Response) => {
    const transaction = await ToyCoinService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/toycoin/burn",
    [
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { amount } = req.body;
      const transaction = await ToyCoinService.burn(amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post(
    "/toycoin/transfer",
    [
      body("recipient").exists(),
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;
      const transaction = await ToyCoinService.transfer(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.get(
    "/toycoin/balance/:account",
    async (req: Request, res: Response) => {
      const balance = await ToyCoinService.getBalance(req.params.account);
      return res.send({
        balance,
      });
    }
  );

  router.get("/toycoin/supply", async (req: Request, res: Response) => {
    const supply = await ToyCoinService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initToyCoinRouter;
