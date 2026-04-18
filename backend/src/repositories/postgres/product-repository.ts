import { PrismaClient, Product } from "../../../generated/prisma";
import {
  CreateProductDTO,
  IProductRepository,
} from "../../controllers/product/interfaces";
import { Pagination } from "../../core/pagination";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";

export class ProductRepository implements IProductRepository {
  async findAll(
    query?: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<Product>>> {
    itemsPerPage = Math.min(50, Math.max(1, itemsPerPage ?? 10));
    page = Math.max(1, page ?? 1);

    const where = query
      ? { name: { contains: query, mode: "insensitive" as const } }
      : {};

    try {
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: { name: "asc" },
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
        }),
        prisma.product.count(),
      ]);

      return {
        ok: true,
        body: { list: products, total, itemsPerPage, page },
      };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async findById(id: string): Promise<Result<Product | null>> {
    try {
      const product = await prisma.product.findUnique({ where: { id } });

      return { ok: true, body: product };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async create(
    product: CreateProductDTO,
    transaction: PrismaClient,
  ): Promise<Result<Product>> {
    try {
      const createdProduct = await transaction.product.create({
        data: {
          ...product,
          type: product.type ?? "PURCHASE",
          consumptionType: product.consumptionType ?? "PRODUCTION",
        },
      });

      return { ok: true, body: createdProduct };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async update(
    id: string,
    product: Partial<Product>,
  ): Promise<Result<Product>> {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: product,
      });

      return { ok: true, body: updatedProduct };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async delete(ids: string[]): Promise<Result<void>> {
    try {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { active: false },
      });

      return { ok: true, body: undefined };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }
}
