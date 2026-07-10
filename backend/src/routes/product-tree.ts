import { Request, Response, Router } from "express";
import { validationMiddleware } from "../middlewares/validation";
import { ProductTreeRepository } from "../repositories/postgres/product-tree";
import { ProductTreeController } from "../controllers/product-tree";
import {
  deleteProductTreeSchema,
  createProductTreeSchema,
  updateProductTreeSchema,
} from "../schemas/product-tree";

export const productTreeRouter = Router();
const productTreeRepository = new ProductTreeRepository();
const productTreeController = new ProductTreeController(productTreeRepository);

productTreeRouter.get("/:id", async (req: Request, res: Response) => {
  const itemsPerPage = req.query.itemsPerPage
    ? Number(req.query.itemsPerPage)
    : undefined;

  const page = req.query.page ? Number(req.query.page) : undefined;

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  console.log("parentId", req.params);

  if (!id)
    return res
      .status(400)
      .json({ error: "Informe um código de produto pai para a busca" });

  const { body, statusCode } = await productTreeController.getByParentId(
    id,
    itemsPerPage,
    page,
  );

  return res.status(statusCode).json(body);
});

productTreeRouter.post(
  "/",
  validationMiddleware(createProductTreeSchema),
  async (req: Request, res: Response) => {
    const { body, statusCode } = await productTreeController.createNodes(
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);

productTreeRouter.patch(
  "/",
  validationMiddleware(updateProductTreeSchema),
  async (req: Request, res: Response) => {
    const { body, statusCode } = await productTreeController.updateNode(
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);

productTreeRouter.delete(
  "/",
  validationMiddleware(deleteProductTreeSchema),
  async (req: Request, res: Response) => {
    const { body, statusCode } = await productTreeController.deleteNodes(
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);
