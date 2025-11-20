import { Order } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { CreateOrderDTO, UpdateOrderDTO } from "../../models/order";
import { OrderService } from "../../services/order-service";
import { ICustomerRepository } from "../customer/interfaces";
import { IProductRepository } from "../product/interfaces";
import { IStockRepository } from "../stock/interfaces";
import { IUserRepository } from "../user/interfaces";
import {
  IOrderController,
  IOrderProductRepository,
  IOrderRepository,
  IOrderService,
} from "./interfaces";

export class OrderController implements IOrderController {
  private readonly service: IOrderService;

  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderProductRepository: IOrderProductRepository,
    private readonly userRepository: IUserRepository,
    private readonly productRepository: IProductRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly stockRepository: IStockRepository
  ) {
    this.service = new OrderService(
      userRepository,
      orderRepository,
      orderProductRepository,
      productRepository,
      customerRepository,
      stockRepository
    );
  }

  async getAllOrders(): Promise<HttpResponse<Order[]>> {
    const result = await this.orderRepository.findAll();

    return toHttpResponse(result);
  }

  async getOrderById(id: number): Promise<HttpResponse<Order | null>> {
    const result = await this.orderRepository.findById(id);

    return toHttpResponse(result);
  }

  async createOrder(newOrder: CreateOrderDTO): Promise<HttpResponse<Order>> {
    const orderResult = await this.service.createOrder(newOrder);

    return toHttpResponse(orderResult);
  }

  async updateOrder(
    id: number,
    order: UpdateOrderDTO
  ): Promise<HttpResponse<Order>> {
    const result = await this.service.updateOrder(id, order);

    return toHttpResponse(result);
  }

  async cancelOrder(
    orderId: number,
    order: { userId: string; customerId: string }
  ): Promise<HttpResponse<Order>> {
    const result = await this.service.updateOrder(orderId, {
      ...order,
      status: "CANCELLED",
      products: [],
    });

    return toHttpResponse(result);
  }
}
