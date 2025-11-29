import { Order, PrismaClient } from "../../../generated/prisma";
import { IOrderRepository } from "../../controllers/order/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";
import { CreateOrderDTO, UpdateOrderDTO } from "../../models/order";

export class OrderRepository implements IOrderRepository {
  async findAll(): Promise<Result<Order[]>> {
    try {
      const orders = await prisma.order.findMany();

      return { ok: true, body: orders };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }

  async findById(id: number): Promise<Result<Order | null>> {
    try {
      const order = await prisma.order.findUnique({ where: { id } });

      return { ok: true, body: order };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }

  async create(
    newOrder: CreateOrderDTO
  ): Promise<Result<void>> {
    try {
      await prisma.$transaction(async (transaction) => {
        const productsJson = JSON.stringify(newOrder.products)

        await transaction.$executeRaw`
        select create_order(
          row(
            ${newOrder.customerId}::uuid,
            ${newOrder.userId}::uuid,
            ${newOrder.comment}::text,
            (
              select array_agg(
                row(
                  p."productId"::uuid,
                  p."quantity"::int
                )::orderProduct
              )
              from jsonb_to_recordset(${productsJson}::jsonb) 
              as p("productId" text, "quantity" text)
            )
          )::orderCreationDTO
        )`;
      });

      return { ok: true, body: undefined };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }

  async update(
    id: number,
    order: UpdateOrderDTO,
    transaction: PrismaClient
  ): Promise<Result<Order>> {
    try {
      const { products: _products, ...data } = order;

      if (Object.keys(data).length === 0)
        return { ok: true, body: {} as Order };

      const updatedOrder = await transaction.order.update({
        where: { id },
        data,
      });

      return { ok: true, body: updatedOrder };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }
}
