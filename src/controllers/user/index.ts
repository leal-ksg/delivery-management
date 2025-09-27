import type { User } from "../../models/user.js";
import type { IUserController, IUserRepository } from "./interfaces.js";

export class UserController implements IUserController {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll() 
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id)

    return user
  }
  async createUser(user: Omit<User, "id">): Promise<User> {
    const newUser = await this.userRepository.create(user)

    return newUser
  }
  async updateUser(id: string, user: Omit<User, "id">): Promise<User> {
    const updatedUser = await this.userRepository.update(id, user)

    return updatedUser
  }
  async deleteUser(id: string): Promise<void> {
    return await this.userRepository.delete(id)
  }
}
