import { Order } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { CreateOrderDTO, UpdateOrderDTO } from "../../models/order";
import { OrderService } from "../../services/order-service";
import { ICustomerRepository } from "../customer/interfaces";
import { IProductRepository } from "../product/interfaces";
import { IUserRepository } from "../user/interfaces";
import {
  IOrderController,
  IOrderRepository,
  IOrderService,
} from "./interfaces";

export class OrderController implements IOrderController {
  private readonly service: IOrderService;

  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly userRepository: IUserRepository,
    private readonly productRepository: IProductRepository,
    private readonly customerRepository: ICustomerRepository
    // TODO: private readonly stockRepo: IStockRepository,
  ) {
    this.service = new OrderService(
      userRepository,
      orderRepository,
      productRepository,
      customerRepository
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

    return toHttpResponse(orderResult)
  }

  async updateOrder(
    id: number,
    order: UpdateOrderDTO
  ): Promise<HttpResponse<Order>> {
    const result = await this.service.updateOrder(id, order);

    return toHttpResponse(result);
  }

  async cancelOrder(id: number): Promise<HttpResponse<Order>> {
    const result = await this.orderRepository.update(id, {status: 'CANCELLED'});

    return toHttpResponse(result);
  }
}
