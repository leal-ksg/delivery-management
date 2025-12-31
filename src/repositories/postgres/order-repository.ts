import { Order } from "../../../generated/prisma";
import { CreateOrderDTO, IOrderRepository, UpdateOrderDTO } from "../../controllers/order/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";

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
    order: UpdateOrderDTO
  ): Promise<Result<void>> {
    try {
      const { products: _products, ...data } = order;

      if (Object.keys(data).length === 0)
        return { ok: true, body: undefined };

      await prisma.$transaction(async (transaction) => {
        const productsJson = JSON.stringify(_products ?? [])

        await transaction.$executeRaw`
        select update_order(
          row(
            ${id}::int,
            ${data.comment}::text,
            ${data.customerId}::uuid,
            ${data.status},
            ${data.userId}::uuid,
            (
              select coalesce(
                array_agg(
                  row(
                    p."productId"::uuid,
                    p."quantity"::int
                  )::orderProduct
                ),
                array[]::orderProduct[]
              )
              from jsonb_to_recordset(${productsJson}::jsonb) 
              as p("productId" text, "quantity" text)
            )
          )::orderUpdateDTO
        )`;
      });

      return { ok: true, body: undefined };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }
}
