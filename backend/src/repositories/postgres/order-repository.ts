import { Order } from "../../../generated/prisma";
import {
  CreateOrderDTO,
  IOrderRepository,
  OrderDTO,
  UpdateOrderDTO,
} from "../../controllers/order/interfaces";
import { Pagination } from "../../core/pagination";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";

export class OrderRepository implements IOrderRepository {
  async findAll(
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<OrderDTO>>> {
    itemsPerPage = Math.min(50, Math.max(1, itemsPerPage ?? 10));
    page = Math.max(1, page ?? 1);

    try {
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          include: {
            orderProducts: {
              include: {
                product: {
                  select: { name: true, unitPrice: true, type: true },
                },
              },
            },
          },
          orderBy: { id: "desc" },
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
        }),
        prisma.order.count(),
      ]);

      return {
        ok: true,
        body: {
          list: orders,
          total,
          itemsPerPage,
          page,
        },
      };
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Pedido"),
      };
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

  async create(newOrder: CreateOrderDTO): Promise<Result<void>> {
    try {
      await prisma.$transaction(async (transaction) => {
        const productsJson = JSON.stringify(newOrder.products);

        await transaction.$executeRaw`
        select create_order(
          row(
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

  async update(id: number, order: UpdateOrderDTO): Promise<Result<void>> {
    try {
      const { products: _products, ...data } = order;

      console.log(data);

      await prisma.$transaction(async (transaction) => {
        const productsJson = JSON.stringify(_products ?? []);

        console.log(productsJson);
        await transaction.$executeRaw`
        select update_order(
          row(
            ${id}::int,
            ${data.comment}::text,
            ${data.status},
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
