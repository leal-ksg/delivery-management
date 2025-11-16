import { Request, Response, Router } from "express";
import { ProductRepository } from "../repositories/postgres/product-repository";
import { ProductController } from "../controllers/product";
import { StockRepository } from "../repositories/postgres/stock-repository";

export const productRouter = Router();
const productRepository = new ProductRepository();
const stockRepository = new StockRepository();
const productController = new ProductController(
  productRepository,
  stockRepository
);

productRouter.get("/", async (req: Request, response: Response) => {
  const { statusCode, body } = await productController.getAllProducts();

  return response.status(statusCode).json(body);
});

productRouter.get("/:id", async (req: Request, response: Response) => {
  const { statusCode, body } = await productController.getProductById(
    req.params.id!
  );

  return response.status(statusCode).json(body);
});

productRouter.post("/", async (req: Request, response: Response) => {
  const { statusCode, body } = await productController.createProduct(req.body);

  return response.status(statusCode).json(body);
});

productRouter.patch("/:id", async (req: Request, response: Response) => {
  const { statusCode, body } = await productController.updateProduct(
    req.params.id!,
    req.body
  );

  return response.status(statusCode).json(body);
});

productRouter.delete("/:id", async (req: Request, response: Response) => {
  const { statusCode, body } = await productController.deleteProduct(
    req.params.id!
  );

  return response.status(statusCode).json(body);
});
