import { ICustomerRepository } from "../controllers/customer/interfaces";
import {
  CreateOrderDTO,
  IOrderProductRepository,
  IOrderRepository,
  IOrderService,
  UpdateOrderDTO,
} from "../controllers/order/interfaces";
import { IProductRepository } from "../controllers/product/interfaces";
import { IStockRepository } from "../controllers/stock/interfaces";
import { IUserRepository } from "../controllers/user/interfaces";
import { Result, ValidationResult } from "../core/result";
export class OrderService implements IOrderService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly orderRepo: IOrderRepository,
    private readonly orderProductRepo: IOrderProductRepository,
    private readonly productRepo: IProductRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly stockRepo: IStockRepository
  ) {}

  async validate(
    order: CreateOrderDTO | UpdateOrderDTO,
    orderId?: number
  ): Promise<ValidationResult> {
    if (order.userId) {
      const userResult = await this.userRepo.findById(order.userId!);

      if (!userResult.ok) return { succeed: false, message: userResult.error };

      if (!userResult.body)
        return {
          succeed: false,
          message: "Usuário não encontrado para finalizar o pedido",
        };

      if (!userResult.body.active)
        return {
          succeed: false,
          message: `Usuário ${userResult.body.name} ${userResult.body.surname} não está ativo`,
        };
    }

    if (order.customerId) {
      const customerResult = await this.customerRepo.findById(
        order.customerId!
      );

      if (!customerResult.ok)
        return { succeed: false, message: customerResult.error };

      if (!customerResult.body)
        return {
          succeed: false,
          message: "Cliente não encontrado para finalizar o pedido",
        };
    }

    if ((!order.products || !order.products.length) && !orderId) {
      const message = `Não foi informado nenhum produto para o pedido`;
      return { succeed: false, message };
    }

    for (const orderProduct of order.products ?? []) {
      const productResult = await this.productRepo.findById(
        orderProduct.productId
      );

      if (!productResult.ok)
        return { succeed: false, message: productResult.error };

      if (!productResult.body)
        return {
          succeed: false,
          message:
            "Não foi possível encontrar um dos produtos para finalizar o pedido",
        };

      if (!productResult.body.active)
        return {
          succeed: false,
          message:
            `O produto ${productResult.body.name} não está ativo`,
        };
    }

    return { succeed: true, message: null };
  }

  async createOrder(newOrder: CreateOrderDTO): Promise<Result<void>> {
    const validationResult = await this.validate(newOrder);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message! };
    }

    const orderResult = await this.orderRepo.create(newOrder);

    return orderResult;
  }

  async updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<void>> {
    const validationResult = await this.validate(order, id);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message };
    }

    const orderInfoResult = await this.orderRepo.findById(id);

    if (!orderInfoResult.ok) return orderInfoResult;

    if (!orderInfoResult.body)
      return { ok: false, error: "Esse pedido não existe" };

    if (
      orderInfoResult.body.status !== "PENDING" &&
      orderInfoResult.body.status !== "IN_PROGRESS" &&
      orderInfoResult.body.status !== "READY_FOR_DELIVERY"
    )
      return {
        ok: false,
        error: "Não é possível alterar pedidos após a saída para entrega",
      };

    const orderUpdateResult = await this.orderRepo.update(id, order);

    return orderUpdateResult;
  }
}
