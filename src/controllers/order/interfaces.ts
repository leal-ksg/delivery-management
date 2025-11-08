import { Order } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";
import { CreateOrderDTO, UpdateOrderDTO } from "../../models/order";

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
  create(newOrder: CreateOrderDTO): Promise<Result<Order>>;
  update(id: number, order: Partial<Order>): Promise<Result<Order>>;
}

export interface IOrderController {
  getAllOrders(): Promise<HttpResponse<Order[]>>;
  getOrderById(id: number): Promise<HttpResponse<Order | null>>;
  createOrder(newOrder: CreateOrderDTO): Promise<HttpResponse<Order>>;
  updateOrder(id: number, order: Partial<Order>): Promise<HttpResponse<Order>>;
  cancelOrder(id: number): Promise<HttpResponse<Order>>;
}
