import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;
  const secret = process.env.JWT_SECRET;

  if (!authorization)
    return res.status(401).send({ error: "Favor realizar login" });

  if (!secret)
    return res.status(500).send({ error: "Falha durante a autenticação" });

  const token = authorization.split(" ")[1];
  if (!token) return res.status(401).send({ error: "Usuário não autorizado" });

  try {
    const payload = jwt.verify(token, secret);

    req.userId = payload.sub as string;
    next();
  } catch {
    return res.status(401).send({ error: "Usuário não autorizado" });
  }
}
