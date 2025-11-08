import { Order } from "../../generated/prisma";
import { ICustomerRepository } from "../controllers/customer/interfaces";
import {
  IOrderRepository,
  IOrderService,
} from "../controllers/order/interfaces";
import { IProductRepository } from "../controllers/product/interfaces";
import { IUserRepository } from "../controllers/user/interfaces";
import { Result } from "../core/result";
import { CreateOrderDTO, UpdateOrderDTO } from "../models/order";

export class OrderService implements IOrderService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly orderRepo: IOrderRepository,
    private readonly productRepo: IProductRepository,
    private readonly customerRepo: ICustomerRepository
    // TODO: private readonly stockRepo: IStockRepository,
  ) {}

  async validate(order: CreateOrderDTO | UpdateOrderDTO): Promise<{
    succeed: boolean;
    message: string | null;
  }> {
    const userResult = await this.userRepo.findById(order.userId);

    if (!userResult.ok) return { succeed: false, message: userResult.error };

    if (!userResult.body)
      return {
        succeed: false,
        message: "Usuário não encontrado para finalizar o pedido",
      };

    const customerResult = await this.customerRepo.findById(
      order.customerId
    );

    if (!customerResult.ok)
      return { succeed: false, message: customerResult.error };

    if (!customerResult.body)
      return {
        succeed: false,
        message: "Cliente não encontrado para finalizar o pedido",
      };

    for (const product of order.products) {
      const productResult = await this.productRepo.findById(product.productId);

      if (!productResult.ok)
        return { succeed: false, message: productResult.error };

      if (!productResult.body)
        return {
          succeed: false,
          message:
            "Não foi possível encontrar um dos produtos para finalizar o pedido",
        };
    }

    return { succeed: true, message: null };
  }

  async createOrder(newOrder: CreateOrderDTO): Promise<Result<Order>> {
    const validationResult = await this.validate(newOrder);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message! };
    }

    const orderCreationResult = await this.orderRepo.create(newOrder)

    return orderCreationResult
  }

  async updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<Order>> {
    const validationResult = await this.validate(order);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message! };
    }

    const orderUpdateResult = await this.orderRepo.update(id, order)

    return orderUpdateResult
  }
}
