import { Request, Response, Router } from "express";
import { OrderController } from "../controllers/order";
import { OrderRepository } from "../repositories/postgres/order-repository";
import { ProductRepository } from "../repositories/postgres/product-repository";

export const orderRouter = Router();
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const orderController = new OrderController(orderRepository, productRepository);

orderRouter.get("/", async (req: Request, res: Response) => {
  const itemsPerPage = req.query.itemsPerPage
    ? Number(req.query.itemsPerPage)
    : undefined;

  const page = req.query.page ? Number(req.query.page) : undefined;

  const { statusCode, body } = await orderController.getAllOrders(
    itemsPerPage,
    page,
  );

  return res.status(statusCode).json(body);
});

orderRouter.get("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await orderController.getOrderById(
    Number(req.params.id),
  );

  return res.status(statusCode).json(body);
});

orderRouter.post("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await orderController.createOrder(req.body);

  return res.status(statusCode).json(body);
});

orderRouter.patch("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await orderController.updateOrder(
    Number(req.params.id),
    req.body,
  );

  return res.status(statusCode).json(body);
});

orderRouter.patch("/cancel/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await orderController.cancelOrder(
    Number(req.params.id),
    req.body,
  );

  return res.status(statusCode).json(body);
});
