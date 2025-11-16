import { Prisma } from "../../../generated/prisma";
import { IOrderProductRepository } from "../../controllers/order/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { OrderProduct } from "../../models/order";

export class OrderProductRepository implements IOrderProductRepository {
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
