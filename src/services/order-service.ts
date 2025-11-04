import { Order } from "../../generated/prisma";
import { ICustomerRepository } from "../controllers/customer/interfaces";
import { IOrderService } from "../controllers/order/interfaces";
import { IProductRepository } from "../controllers/product/interfaces";
import { IUserRepository } from "../controllers/user/interfaces";
import { Result } from "../core/result";
import { CreateOrderDTO } from "../models/order";

export class OrderService implements IOrderService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly orderRepo: IUserRepository, // TODO: change to IOrderRepository
    private readonly productRepo: IProductRepository,
    private readonly customerRepo: ICustomerRepository
    // TODO: private readonly stockRepo: IStockRepository,
  ) {}

  async validate(newOrder: CreateOrderDTO): Promise<{
    succeed: boolean;
    message: string | null;
  }> {
    const userResult = await this.userRepo.findById(newOrder.userId);

    if (!userResult.ok) return { succeed: false, message: userResult.error };

    if (!userResult.body)
      return {
        succeed: false,
        message: "Usuário não encontrado para finalizar o pedido",
      };

    const customerResult = await this.customerRepo.findById(
      newOrder.customerId
    );

    if (!customerResult.ok)
      return { succeed: false, message: customerResult.error };

    if (!customerResult.body)
      return {
        succeed: false,
        message: "Cliente não encontrado para finalizar o pedido",
      };

    for (const product of newOrder.products) {
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

  createOrder(newOrder: CreateOrderDTO): Result<Order | null> {
    throw new Error("Method not implemented.");
  }
}
