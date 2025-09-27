import type { User } from "../../models/user.js";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  create(user: Omit<User, "id">): Promise<User>;
  update(id: string, user: Omit<User, "id">): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface IUserController {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: string, user: Omit<User, "id">): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
