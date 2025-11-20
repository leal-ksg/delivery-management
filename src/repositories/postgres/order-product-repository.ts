import { Prisma } from "../../../generated/prisma";
import { IOrderProductRepository } from "../../controllers/order/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";
import { OrderProduct } from "../../models/order";

export class OrderProductRepository implements IOrderProductRepository {
  async findMany(orderId: number): Promise<Result<OrderProduct[]>> {
    try {
      const orderProducts = await prisma.orderProduct.findMany({ where: { orderId } });

      return { ok: true, body: orderProducts };
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Produto do pedido"),
      };
    }
  }

  async createMany(
    products: OrderProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>> {
    try {
      await transaction.orderProduct.createMany({ data: products });

      return { ok: true, body: undefined };
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Produto do pedido"),
      };
    }
  }

  async replace(
    orderId: number,
    products: OrderProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>> {
    try {
      await transaction.orderProduct.deleteMany({ where: { orderId } });

      await transaction.orderProduct.createMany({ data: products });

      return { ok: true, body: undefined };
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Produto do pedido"),
      };
    }
  }
}
