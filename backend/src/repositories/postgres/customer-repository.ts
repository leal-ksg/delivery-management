import { ICustomerRepository } from "../../controllers/customer/interfaces";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Customer } from "../../../generated/prisma";
import { Pagination } from "../../core/pagination";

export class CustomerRepository implements ICustomerRepository {
  async findAll(
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<Customer>>> {
    itemsPerPage = Math.min(50, Math.max(1, itemsPerPage ?? 10));
    page = Math.max(1, page ?? 1);

    try {
      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          orderBy: [{ name: "asc" }, { surname: "asc" }],
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
        }),
        prisma.customer.count(),
      ]);

      return {
        ok: true,
        body: { list: customers, total, itemsPerPage, page },
      };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
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
    customer: Partial<Customer>,
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

  async delete(ids: string[]): Promise<Result<void>> {
    try {
      await prisma.customer.updateMany({
        where: { id: { in: ids } },
        data: { active: false },
      });

      return { ok: true, body: undefined };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Cliente") };
    }
  }
}
