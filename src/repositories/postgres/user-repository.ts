import type { IUserRepository } from "../../controllers/user/interfaces";
import { prisma } from "../../database/prisma";
import { Result } from "../../core/result";
import type { User } from "../../models/user";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";

export class PostgresUserRepository implements IUserRepository {
  async findAll(): Promise<Result<User[]>> {
    try {
      const users = await prisma.user.findMany();
      return { ok: true, body: users };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Usuário") };
    }
  }

  async findById(id: string): Promise<Result<User>> {
    try {
      const user = (await prisma.user.findUnique({
        where: { id },
      })) as unknown as User;
      return { ok: true, body: user };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Usuário") };
    }
  }

  async create(user: Omit<User, "id">): Promise<Result<User>> {
    console.log(user);
    try {
      const createdUser = await prisma.user.create({ data: user });
      return { ok: true, body: createdUser };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Usuário") };
    }
  }

  async update(id: string, user: Partial<User>): Promise<Result<User>> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: user,
      });

      return { ok: true, body: updatedUser };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Usuário") };
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await prisma.user.delete({ where: { id } });

      return { ok: true, body: undefined };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Usuário") };
    }
  }
}
