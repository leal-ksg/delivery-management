import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user";
import { UserRepository } from "../repositories/postgres/user-repository";

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

export const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await userController.getAllUsers();
  return res.status(statusCode).json(body);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await userController.getUserById(req.params.id!);
  return res.status(statusCode).json(body);
});

userRouter.post("/", async (req: Request, res: Response) => {
  const { statusCode, body } = await userController.createUser(req.body);
  return res.status(statusCode).json(body);
});

userRouter.patch("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await userController.updateUser(req.params.id!, req.body);
  return res.status(statusCode).json(body);
});

userRouter.delete("/:id", async (req: Request, res: Response) => {
  const { statusCode, body } = await userController.deleteUser(req.params.id!);
  return res.status(statusCode).json(body);
});
