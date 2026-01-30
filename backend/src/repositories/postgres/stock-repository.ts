import { Prisma, PrismaClient } from "../../../generated/prisma";
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

  async findById(productId: string): Promise<Result<Stock>> {
    try {
      const productStock = await prisma.stock.findUnique({
        where: {
          productId,
        },
      });

      return { ok: true, body: productStock || { productId, quantity: 0 } };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }

  async create(data: Stock, transaction: PrismaClient): Promise<Result<Stock>> {
    try {
      const createdStock = await transaction.stock.create({ data });

      return { ok: true, body: createdStock };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }

  async increase(
    data: Stock,
    transaction: Prisma.TransactionClient
  ): Promise<Result<Stock>> {
    try {
      const stock = await transaction.stock.update({
        where: { productId: data.productId },
        data: {
          quantity: {
            increment: data.quantity,
          },
        },
      });

      return { ok: true, body: stock };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }

  async decrease(
    data: Stock,
    transaction: Prisma.TransactionClient
  ): Promise<Result<Stock>> {
    try {
      const stock = await transaction.stock.update({
        where: { productId: data.productId },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });

      return { ok: true, body: stock };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Estoque") };
    }
  }
}
