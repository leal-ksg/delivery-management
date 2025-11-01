import { Request, Response, Router } from "express";
import { CustomerController } from "../controllers/customer";
import { PostgresCustomerRepository } from "../repositories/postgres/customer-repository";

export const customerRouter = Router();
const customerRepository = new PostgresCustomerRepository();
const customerController = new CustomerController(customerRepository);

customerRouter.get("/", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.getAllCustomers();

  return res.status(statusCode).json(body);
});

customerRouter.get("/:id", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.getCustomerById(req.params.id!);

  return res.status(statusCode).json(body);
});

customerRouter.post("/", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.createCustomer(req.body);

  return res.status(statusCode).json(body);
});

customerRouter.patch("/:id", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.updateCustomer(req.params.id!, req.body);

  return res.status(statusCode).json(body);
});

customerRouter.delete("/:id", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.deleteCustomer(req.params.id!);

  return res.status(statusCode).json(body);
});
