import { Request, Response, Router } from "express";
import { OrderController } from "../controllers/order";
import { OrderRepository } from "../repositories/postgres/order-repository";
import { OrderProductRepository } from "../repositories/postgres/order-product-repository";
import { UserRepository } from "../repositories/postgres/user-repository";
import { ProductRepository } from "../repositories/postgres/product-repository";
import { CustomerRepository } from "../repositories/postgres/customer-repository";
import { StockRepository } from "../repositories/postgres/stock-repository";

export const orderRouter = Router();
const orderRepository = new OrderRepository();
const orderProductRepository = new OrderProductRepository();
const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const customerRepository = new CustomerRepository();
const stockRepository = new StockRepository();
const orderController = new OrderController(
  orderRepository,
  orderProductRepository,
  userRepository,
  productRepository,
  customerRepository,
  stockRepository
);

orderRouter.get("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await orderController.getAllOrders();

  return res.status(statusCode).json(body);
});

orderRouter.get("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await orderController.getOrderById(
    Number(req.params.id)
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
    req.body
  );

  return res.status(statusCode).json(body);
});

orderRouter.patch("/cancel/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await orderController.cancelOrder(
    Number(req.params.id),
    req.body
  );

  return res.status(statusCode).json(body);
});
