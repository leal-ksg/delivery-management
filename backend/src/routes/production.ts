import { Router, Request, Response } from "express";
import { ProductionRepository } from "../repositories/postgres/production-repository";
import { ProductRepository } from "../repositories/postgres/product-repository";
import { ProductionController } from "../controllers/production";

const productionRepository = new ProductionRepository();
const productRepository = new ProductRepository();
const productionController = new ProductionController(
  productRepository,
  productionRepository
);

export const productionRouter = Router();

productionRouter.get("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await productionController.getAllProductions();

  return res.status(statusCode).json(body);
});

productionRouter.get("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await productionController.getProductionById(
    Number(req.params.id)
  );

  return res.status(statusCode).json(body);
});

productionRouter.post("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await productionController.createProduction(
    req.body
  );

  return res.status(statusCode).json(body);
});

productionRouter.patch("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await productionController.updateProduction(
    Number(req.params.id),
    req.body
  );

  return res.status(statusCode).json(body);
});
