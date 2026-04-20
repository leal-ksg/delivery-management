import { Order } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { OrderService } from "../../services/order-service";
import { IProductRepository } from "../product/interfaces";
import {
  CreateOrderDTO,
  IOrderController,
  IOrderRepository,
  IOrderService,
  UpdateOrderDTO,
} from "./interfaces";

export class OrderController implements IOrderController {
  private readonly service: IOrderService;

  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
  ) {
    this.service = new OrderService(orderRepository, productRepository);
  }

  async getAllOrders(): Promise<HttpResponse<Order[]>> {
    const result = await this.orderRepository.findAll();

    return toHttpResponse(result);
  }

  async getOrderById(id: number): Promise<HttpResponse<Order | null>> {
    const result = await this.orderRepository.findById(id);

    return toHttpResponse(result);
  }

  async createOrder(newOrder: CreateOrderDTO): Promise<HttpResponse<void>> {
    const orderResult = await this.service.createOrder(newOrder);

    return toHttpResponse(orderResult, 201);
  }

  async updateOrder(
    id: number,
    order: UpdateOrderDTO,
  ): Promise<HttpResponse<void>> {
    const result = await this.service.updateOrder(id, order);

    return toHttpResponse(result);
  }

  async cancelOrder(
    orderId: number,
    order: { userId: string; customerId: string },
  ): Promise<HttpResponse<void>> {
    const result = await this.service.updateOrder(orderId, {
      ...order,
      status: "CANCELLED",
      products: [],
    });

    return toHttpResponse(result);
  }
}
