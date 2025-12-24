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
    order: CreateOrderDTO | UpdateOrderDTO,
    orderId?: number
  ): Promise<{ succeed: boolean; message: string | null }>;
  createOrder(newOrder: CreateOrderDTO): Promise<Result<void>>;
  updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<Order>>;
}

export interface IOrderRepository {
  findAll(): Promise<Result<Order[]>>;
  findById(id: number): Promise<Result<Order | null>>;
  create(
    newOrder: CreateOrderDTO
  ): Promise<Result<void>>;
  update(
    id: number,
    order: UpdateOrderDTO,
    transaction: Prisma.TransactionClient
  ): Promise<Result<Order>>;
}

export interface IOrderController {
  getAllOrders(): Promise<HttpResponse<Order[]>>;
  getOrderById(id: number): Promise<HttpResponse<Order | null>>;
  createOrder(newOrder: CreateOrderDTO): Promise<HttpResponse<void>>;
  updateOrder(id: number, order: UpdateOrderDTO): Promise<HttpResponse<Order>>;
  cancelOrder(
    id: number,
    order: { userId: string; customerId: string }
  ): Promise<HttpResponse<Order>>;
}

export interface IOrderProductRepository {
  findById(
    orderId: number,
    productId: string
  ): Promise<Result<OrderProduct | null>>;
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
