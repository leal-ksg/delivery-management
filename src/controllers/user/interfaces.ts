import type { HttpResponse } from "../../core/http-response.js";
import type { Result } from "../../core/result.js";
import type { User } from "../../models/user.js";

export interface IUserRepository {
  findAll(): Promise<Result<Omit<User, 'password'>[]>>;
  findById(id: string): Promise<Result<Omit<User, 'password'> | null>>;
  create(user: Omit<User, "id">): Promise<Result<User>>;
  update(id: string, user: Partial<User>): Promise<Result<User>>;
  delete(id: string): Promise<Result<void>>;
}

export interface IUserController {
  getAllUsers(): Promise<HttpResponse<Omit<User, 'password'>[]>>;
  getUserById(id: string): Promise<HttpResponse<Omit<User, 'password'> | null>>;
  createUser(user: Omit<User, "id">): Promise<HttpResponse<User>>;
  updateUser(id: string, user: Partial<User>): Promise<HttpResponse<User>>;
  deleteUser(id: string): Promise<HttpResponse<void>>;
}
