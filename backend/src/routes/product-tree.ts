import { Request, Response, Router } from "express";
import { updateCustomerSchema } from "../schemas/customer";
import { validationMiddleware } from "../middlewares/validation";
import { ProductTreeRepository } from "../repositories/postgres/product-tree";
import { ProductTreeController } from "../controllers/product-tree";
import { productTreeSchema } from "../schemas/product-tree";

export const productTreeRouter = Router();
const productTreeRepository = new ProductTreeRepository();
const productTreeController = new ProductTreeController(productTreeRepository);

productTreeRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id)
    return res
      .status(400)
      .json({ error: "Informe um código de produto pai para a busca" });

  const { body, statusCode } = await productTreeController.getByParentId(id);

  return res.status(statusCode).json(body);
});

productTreeRouter.post(
  "/",
  validationMiddleware(productTreeSchema),
  async (req: Request, res: Response) => {
    const { body, statusCode } = await productTreeController.createProductTree(
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);

productTreeRouter.patch(
  "/:id",
  validationMiddleware(updateCustomerSchema),
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id)
      return res
        .status(400)
        .json({ error: "Informe um código de produto pai para a atualização" });

    const { body, statusCode } = await productTreeController.replaceProductTree(
      id,
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);
