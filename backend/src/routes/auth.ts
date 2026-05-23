import { Request, Router, Response } from "express";
import { AuthController } from "../controllers/auth";
import { User } from "../../generated/prisma";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { statusCode, body } = await authController.login(email, password);
  let user = {} as Omit<User, "password">;

  if (statusCode !== 200) return res.status(statusCode).json(body);

  if ("token" in body)
    res.cookie("token", body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

  if ("user" in body) 
    user = body.user;

  return res.status(statusCode).json({ user });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");

  return res.sendStatus(204);
});
