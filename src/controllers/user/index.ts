import { toHttpResponse, type HttpResponse } from "../../core/http-response";
import type { User } from "../../models/user.js";
import type { IUserController, IUserRepository } from "./interfaces.js";

export class UserController implements IUserController {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(): Promise<HttpResponse<User[]>> {
    const result = await this.userRepository.findAll();

    return toHttpResponse(result);
  }

  async getUserById(id: string): Promise<HttpResponse<User | null>> {
    const result = await this.userRepository.findById(id);

    return toHttpResponse(result);
  }

  async createUser(user: Omit<User, "id">): Promise<HttpResponse<User>> {
    const result = await this.userRepository.create(user);

    return toHttpResponse(result, 201);
  }

  async updateUser(
    id: string,
    user: Omit<User, "id">
  ): Promise<HttpResponse<User>> {
    const result = await this.userRepository.update(id, user);

    return toHttpResponse(result);
  }

  async deleteUser(id: string): Promise<HttpResponse<void>> {
    const result = await this.userRepository.delete(id)

    return toHttpResponse(result)
  }
}
