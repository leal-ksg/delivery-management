import { IProductRepository } from "../../controllers/product/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";
import { Product } from "../../models/product";

export class PostgresProductRepository implements IProductRepository {
  async findAll(): Promise<Result<Product[]>> {
    try {
      const products = await prisma.product.findMany();

      return { ok: true, body: products };
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

  async create(product: Omit<Product, "id">): Promise<Result<Product>> {
    try {
      const createdProduct = await prisma.product.create({ data: product });

      return { ok: true, body: createdProduct };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async update(
    id: string,
    product: Partial<Product>
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

  async delete(id: string): Promise<Result<void>> {
    try {
      await prisma.product.delete({ where: { id } });

      return { ok: true, body: undefined };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }
}
