import { Request, Response, Router } from "express";
import { PurchaseRepository } from "../repositories/postgres/purchase-repository";
import { StockRepository } from "../repositories/postgres/stock-repository";
import { UserRepository } from "../repositories/postgres/user-repository";
import { PurchaseProductRepository } from "../repositories/postgres/purchase-product-repository";
import { PurchaseController } from "../controllers/purchase";

export const purchaseRouter = Router();
const purchaseRepository = new PurchaseRepository();
const userRepository = new UserRepository();
const purchaseProductRepository = new PurchaseProductRepository();
const stockRepository = new StockRepository();
const purchaseController = new PurchaseController(
  purchaseRepository,
  userRepository,
  purchaseProductRepository,
  stockRepository
);

purchaseRouter.get("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await purchaseController.getAllPurchases();

  return res.status(statusCode).json(body);
});

purchaseRouter.get("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await purchaseController.getPurchaseById(
    Number(req.params.id)
  );

  return res.status(statusCode).json(body);
});

purchaseRouter.post("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await purchaseController.createPurchase(
    req.body
  );

  return res.status(statusCode).json(body);
});

purchaseRouter.patch("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await purchaseController.updatePurchase(
    Number(req.params.id),
    req.body
  );

  return res.status(statusCode).json(body);
});

purchaseRouter.patch("/cancel/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await purchaseController.cancelPurchase(
    Number(req.params.id)
  );

  return res.status(statusCode).json(body);
});
