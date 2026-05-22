import { Request, Router, Response } from "express";
import { AuthController } from "../controllers/auth";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { statusCode, body } = await authController.login(email, password);

  return res.status(statusCode).json(body);
});
