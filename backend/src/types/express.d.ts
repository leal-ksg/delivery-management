import { JwtPayload } from "../seu-caminho/JwtPayload";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export {};
