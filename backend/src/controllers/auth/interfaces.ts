import { User } from "../../../generated/prisma/index.js";
import type { HttpResponse } from "../../core/http-response.js";
import { Result } from "../../core/result.js";

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface IAuthController {
  login(
    email: string,
    password: string,
  ): Promise<HttpResponse<AuthResponse>>;
}

export interface IAuthService {
  login(
    email: string,
    password: string,
  ): Promise<Result<AuthResponse>>;
}
