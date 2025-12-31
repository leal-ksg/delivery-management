import { Order, Prisma, OrderProduct } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result, ValidationResult } from "../../core/result";

export interface CreateOrderDTO {
  customerId: string;
  userId: string;
  comment: string | null;
  products: Omit<OrderProduct, "orderId">[];
}

export interface UpdateOrderDTO extends Partial<Omit<Order, "createdAt">> {
  products?: OrderProduct[];
}

export interface IOrderService {
  validate(
    order: CreateOrderDTO | UpdateOrderDTO,
    orderId?: number
  ): Promise<ValidationResult>;
  createOrder(newOrder: CreateOrderDTO): Promise<Result<void>>;
  updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<void>>;
}

export interface IOrderRepository {
  findAll(): Promise<Result<Order[]>>;
  findById(id: number): Promise<Result<Order | null>>;
  create(
    newOrder: CreateOrderDTO
  ): Promise<Result<void>>;
  update(
    id: number,
    order: UpdateOrderDTO
  ): Promise<Result<void>>;
}

export interface IOrderController {
  getAllOrders(): Promise<HttpResponse<Order[]>>;
  getOrderById(id: number): Promise<HttpResponse<Order | null>>;
  createOrder(newOrder: CreateOrderDTO): Promise<HttpResponse<void>>;
  updateOrder(id: number, order: UpdateOrderDTO): Promise<HttpResponse<void>>;
  cancelOrder(
    id: number,
    order: { userId: string; customerId: string }
  ): Promise<HttpResponse<void>>;
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
