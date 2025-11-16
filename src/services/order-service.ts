import { Order } from "../../generated/prisma";
import { ICustomerRepository } from "../controllers/customer/interfaces";
import {
  IOrderProductRepository,
  IOrderRepository,
  IOrderService,
} from "../controllers/order/interfaces";
import { IProductRepository } from "../controllers/product/interfaces";
import { IStockRepository } from "../controllers/stock/interfaces";
import { IUserRepository } from "../controllers/user/interfaces";
import { parseDatabaseErrorMessage } from "../core/parse-database-error-message";
import { Result } from "../core/result";
import { prisma } from "../database/prisma";
import { CreateOrderDTO, OrderProduct, UpdateOrderDTO } from "../models/order";

type ValidationResult =
  | { succeed: true; message: null }
  | { succeed: false; message: string };

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
    order: CreateOrderDTO | UpdateOrderDTO
  ): Promise<ValidationResult> {
    const userResult = await this.userRepo.findById(order.userId);

    if (!userResult.ok) return { succeed: false, message: userResult.error };

    if (!userResult.body)
      return {
        succeed: false,
        message: "Usuário não encontrado para finalizar o pedido",
      };

    const customerResult = await this.customerRepo.findById(order.customerId);

    if (!customerResult.ok)
      return { succeed: false, message: customerResult.error };

    if (!customerResult.body)
      return {
        succeed: false,
        message: "Cliente não encontrado para finalizar o pedido",
      };

    for (const orderProduct of order.products) {
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

      const product = productResult.body;

      const stockResult = await this.stockRepo.findById(product.id);

      if (!stockResult.ok)
        return { succeed: false, message: stockResult.error };

      if (stockResult.body?.quantity < orderProduct.quantity) {
        const message = `O produto ${product.name} não tem estoque suficiente para esse pedido`;
        return { succeed: false, message };
      }
    }

    return { succeed: true, message: null };
  }

  async createOrder(newOrder: CreateOrderDTO): Promise<Result<Order>> {
    const validationResult = await this.validate(newOrder);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message! };
    }

    try {
      const creationResult = await prisma.$transaction(async (transaction) => {
        const orderResult = await this.orderRepo.create(newOrder, transaction);

        if (!orderResult.ok)
          throw new Error(
            orderResult.error ?? "Não foi possível criar o pedido"
          );

        const orderProducts: OrderProduct[] = []

        for(const {productId, quantity} of newOrder.products) {
          orderProducts.push({productId, quantity, orderId: orderResult.body.id})

          const stockResult = await this.stockRepo.decrease({productId, quantity}, transaction)

          if (!stockResult.ok)
          throw new Error(
            stockResult.error ?? "Não foi possível atualizar o estoque de um produto"
          );
        }

        const orderProductsResult = await this.orderProductRepo.createMany(orderProducts, transaction);

        if (!orderProductsResult.ok)
          throw new Error(
            orderProductsResult.error ?? "Não foi possível salvar os produtos do pedido"
          );

        return orderResult;
      });

      return creationResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }

  async updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<Order>> {
    const validationResult = await this.validate(order);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message };
    }

    const orderUpdateResult = await this.orderRepo.update(id, order);

    return orderUpdateResult;
  }
}
