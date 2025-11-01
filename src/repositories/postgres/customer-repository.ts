import { ICustomerRepository } from "../../controllers/customer/interfaces";
import { Result } from "../../core/result";
import { Customer } from "../../models/customer";
import { prisma } from "../../database/prisma";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";

export class PostgresCustomerRepository implements ICustomerRepository {
  async findAll(): Promise<Result<Customer[]>> {
    try {
      const customers = await prisma.customer.findMany();

      return { ok: true, body: customers };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Cliente") };
    }
  }

  async findById(id: string): Promise<Result<Customer | null>> {
    try {
      const customers = await prisma.customer.findUnique({ where: { id } });

      return { ok: true, body: customers };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Cliente") };
    }
  }

  async create(customer: Omit<Customer, "id">): Promise<Result<Customer>> {
    try {
      const customers = await prisma.customer.create({ data: customer });

      return { ok: true, body: customers };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Cliente") };
    }
  }

  async update(
    id: string,
    customer: Partial<Customer>
  ): Promise<Result<Customer>> {
    try {
      const customers = await prisma.customer.update({
        data: customer,
        where: { id },
      });

      return { ok: true, body: customers };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Cliente") };
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await prisma.customer.delete({ where: { id } });

      return { ok: true, body: undefined };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Cliente") };
    }
  }
}
