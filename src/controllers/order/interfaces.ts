import { Order, Prisma } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";
import {
  CreateOrderDTO,
  OrderProduct,
  UpdateOrderDTO,
} from "../../models/order";

export interface IOrderService {
  validate(
    newOrder: CreateOrderDTO
  ): Promise<{ succeed: boolean; message: string | null }>;
  createOrder(newOrder: CreateOrderDTO): Promise<Result<Order>>;
  updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<Order>>;
}

export interface IOrderRepository {
  findAll(): Promise<Result<Order[]>>;
  findById(id: number): Promise<Result<Order | null>>;
  create(
    newOrder: CreateOrderDTO,
    transaction: Prisma.TransactionClient
  ): Promise<Result<Order>>;
  update(
    id: number,
    order: Partial<Order>,
    transaction: Prisma.TransactionClient
  ): Promise<Result<Order>>;
}

export interface IOrderController {
  getAllOrders(): Promise<HttpResponse<Order[]>>;
  getOrderById(id: number): Promise<HttpResponse<Order | null>>;
  createOrder(newOrder: CreateOrderDTO): Promise<HttpResponse<Order>>;
  updateOrder(id: number, order: Partial<Order>): Promise<HttpResponse<Order>>;
  cancelOrder(
    id: number,
    order: { userId: string; customerId: string }
  ): Promise<HttpResponse<Order>>;
}

export interface IOrderProductRepository {
  findMany(orderId: number): Promise<Result<OrderProduct[]>>;
  createMany(
    products: OrderProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>>;
  replace(
    orderId: number,
    products: OrderProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>>;
}
