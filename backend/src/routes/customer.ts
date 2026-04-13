import { Request, Response, Router } from "express";
import { CustomerController } from "../controllers/customer";
import { CustomerRepository } from "../repositories/postgres/customer-repository";
import { customerSchema, updateCustomerSchema } from "../schemas/customer";
import { validationMiddleware } from "../middlewares/validation";

export const customerRouter = Router();
const customerRepository = new CustomerRepository();
const customerController = new CustomerController(customerRepository);

customerRouter.get("/", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.getAllCustomers();

  return res.status(statusCode).json(body);
});

customerRouter.get("/:id", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.getCustomerById(
    req.params.id!,
  );

  return res.status(statusCode).json(body);
});

customerRouter.post(
  "/",
  validationMiddleware(customerSchema),
  async (req: Request, res: Response) => {
    const { body, statusCode } = await customerController.createCustomer(
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);

customerRouter.patch(
  "/:id",
  validationMiddleware(updateCustomerSchema),
  async (req: Request, res: Response) => {
    if (!req.params.id)
      return res
        .status(400)
        .json({ error: "É necessário um ID para a atualização" });

    const { body, statusCode } = await customerController.updateCustomer(
      req.params.id,
      req.body,
    );

    return res.status(statusCode).json(body);
  },
);

customerRouter.delete("/", async (req: Request, res: Response) => {
  const { body, statusCode } = await customerController.deleteCustomers(
    req.body,
  );

  return res.status(statusCode).json(body);
});
