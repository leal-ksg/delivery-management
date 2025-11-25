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
    newOrder: CreateOrderDTO,
    transaction: PrismaClient
  ): Promise<Result<Order>> {
    try {
      const { products: _products, ...order } = newOrder;

      const createdOrder = await transaction.order.create({ data: order });

      return { ok: true, body: createdOrder };
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
