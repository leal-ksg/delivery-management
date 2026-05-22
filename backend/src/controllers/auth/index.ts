import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { UserRepository } from "../../repositories/postgres/user-repository";
import { AuthService } from "../../services/auth-service";
import { IUserRepository } from "../user/interfaces";
import { AuthResponse, IAuthController, IAuthService } from "./interfaces";

export class AuthController implements IAuthController {
  private _authService: IAuthService;
  private _userRepository: IUserRepository;

  constructor() {
    this._userRepository = new UserRepository();
    this._authService = new AuthService(this._userRepository);
  }

  async login(
    email: string,
    password: string,
  ): Promise<HttpResponse<AuthResponse>> {
    const result = await this._authService.login(email, password);

    return toHttpResponse(result);
  }
}
