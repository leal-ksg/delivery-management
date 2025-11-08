import { IStockRepository } from "../../controllers/stock/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";
import { Stock } from "../../models/stock";

export class StockRepository implements IStockRepository {
  async findAll(): Promise<Result<Stock[]>> {
    try {
      const productsStock = await prisma.stock.findMany({
        where: {
          product: { active: true },
        },
      });

      return { ok: true, body: productsStock };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }

  async findById(productId: string): Promise<Result<Stock | null>> {
    try {
      const productStock = await prisma.stock.findUnique({
        where: {
          productId,
        },
      });

      return { ok: true, body: productStock };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }

  async create(data: Stock): Promise<Result<Stock>> {
    try {
      const createdStock = await prisma.stock.create({ data });

      return { ok: true, body: createdStock };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }

  async update(data: Stock): Promise<Result<Stock>> {
    try {
      const updatedStock = await prisma.stock.update({
        where: {
          productId: data.productId,
        },
        data: {
          quantity: data.quantity,
        },
      });

      return { ok: true, body: updatedStock };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }

  async delete(productId: string): Promise<Result<void>> {
    try {
      await prisma.stock.delete({ where: { productId } });

      return { ok: true, body: undefined };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }
}
