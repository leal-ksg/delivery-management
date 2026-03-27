import { Request, Response, Router } from "express";
import { ProductRepository } from "../repositories/postgres/product-repository";
import { ProductController } from "../controllers/product";
import { StockRepository } from "../repositories/postgres/stock-repository";
import { productSchema, updateProductSchema } from "../schemas/product";
import { validationMiddleware } from "../middlewares/validation";

export const productRouter = Router();
const productRepository = new ProductRepository();
const stockRepository = new StockRepository();
const productController = new ProductController(
  productRepository,
  stockRepository,
);

productRouter.get("/", async (req: Request, res: Response) => {
  const itemsPerPage = req.query.itemsPerPage
    ? Number(req.query.itemsPerPage)
    : undefined;

  const page = req.query.page ? Number(req.query.page) : undefined;

  const { statusCode, body } = await productController.getAllProducts(
    itemsPerPage,
    page,
  );

  return res.status(statusCode).json(body);
});

productRouter.get("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await productController.getProductById(
    req.params.id!,
  );

  return res.status(statusCode).json(body);
});

productRouter.post(
  "/",
  validationMiddleware(productSchema),
  async (req: Request, res: Response) => {
    const { statusCode, body } = await productController.createProduct(
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);

productRouter.patch(
  "/:id",
  validationMiddleware(updateProductSchema),
  async (req: Request, res: Response) => {
    const { statusCode, body } = await productController.updateProduct(
      req.params.id!,
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);

productRouter.delete("/", async (req: Request, res: Response) => {
  console.log(req.body);
  const { statusCode, body } = await productController.deleteProduct(req.body);

  return res.status(statusCode).json(body);
});
