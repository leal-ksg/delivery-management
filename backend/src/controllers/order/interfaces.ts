import {
  Order,
  Prisma,
  OrderProduct,
  ProductType,
} from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Pagination } from "../../core/pagination";
import { Result, ValidationResult } from "../../core/result";

interface OrderProductDTO {
  productId: string;
  quantity: number;
  product: {
    name: string;
    unitPrice: Prisma.Decimal;
    type: ProductType;
  };
}

export interface OrderDTO extends Order {
  orderProducts: OrderProductDTO[];
}

export interface CreateOrderDTO {
  comment: string | null;
  products: Omit<OrderProduct, "orderId">[];
}

export interface UpdateOrderDTO extends Partial<Omit<Order, "createdAt">> {
  products?: OrderProduct[];
}

export interface IOrderService {
  validate(
    order: CreateOrderDTO | UpdateOrderDTO,
    orderId?: number,
  ): Promise<ValidationResult>;
  createOrder(newOrder: CreateOrderDTO): Promise<Result<void>>;
  updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<void>>;
}

export interface IOrderRepository {
  findAll(
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<OrderDTO>>>;
  findById(id: number): Promise<Result<Order | null>>;
  create(newOrder: CreateOrderDTO): Promise<Result<void>>;
  update(id: number, order: UpdateOrderDTO): Promise<Result<void>>;
}

export interface IOrderController {
  getAllOrders(
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<OrderDTO>>>;
  getOrderById(id: number): Promise<HttpResponse<Order | null>>;
  createOrder(newOrder: CreateOrderDTO): Promise<HttpResponse<void>>;
  updateOrder(id: number, order: UpdateOrderDTO): Promise<HttpResponse<void>>;
  cancelOrder(
    id: number,
    order: { userId: string; customerId: string },
  ): Promise<HttpResponse<void>>;
}

export interface IOrderProductRepository {
  findById(
    orderId: number,
    productId: string,
  ): Promise<Result<OrderProduct | null>>;
  findMany(orderId: number): Promise<Result<OrderProduct[]>>;
  createMany(
    products: OrderProduct[],
    transaction: Prisma.TransactionClient,
  ): Promise<Result<void>>;
  replace(
    orderId: number,
    products: OrderProduct[],
    transaction: Prisma.TransactionClient,
  ): Promise<Result<void>>;
}
