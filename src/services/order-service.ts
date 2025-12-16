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
import { CreateOrderDTO, UpdateOrderDTO } from "../models/order";

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
    if (order.userId) {
      const userResult = await this.userRepo.findById(order.userId!);

      if (!userResult.ok) return { succeed: false, message: userResult.error };

      if (!userResult.body)
        return {
          succeed: false,
          message: "Usuário não encontrado para finalizar o pedido",
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

    if (!order.products || !order.products.length) {
      const message = `Não foi informado nenhum produto para o pedido`;
      return { succeed: false, message };
    }

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
    }

    return { succeed: true, message: null };
  }

  async createOrder(newOrder: CreateOrderDTO): Promise<Result<void>> {
    const validationResult = await this.validate(newOrder);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message! };
    }

    const orderResult = await this.orderRepo.create(newOrder);

    return orderResult
  }

  async updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<Order>> {
    const validationResult = await this.validate(order);

    if (!validationResult.succeed) {
      return { ok: false, error: validationResult.message };
    }

    try {
      const updateResult = await prisma.$transaction(async (transaction) => {
        const orderInfoResult = await this.orderRepo.findById(id);

        if (!orderInfoResult.ok)
          throw new Error(
            orderInfoResult.error ??
              "Não foi possível buscar o pedido para atualização"
          );

        if (!orderInfoResult.body) throw new Error("Esse pedido não existe");

        const orderUpdateResult = await this.orderRepo.update(
          id,
          order,
          transaction
        );

        if (!orderUpdateResult.ok)
          throw new Error(
            orderUpdateResult.error ?? "Ocorreu um erro ao atualizar o pedido"
          );

        if (!order.products?.length) return orderUpdateResult;

        const orderProductsResult = await this.orderProductRepo.findMany(id);

        if (!orderProductsResult.ok)
          throw new Error(
            orderProductsResult.error ??
              "Ocorreu um erro ao buscar os produtos do pedido"
          );

        for (const { productId, quantity } of orderProductsResult.body) {
          const stockIncreaseResult = await this.stockRepo.increase(
            { productId, quantity },
            transaction
          );

          if (!stockIncreaseResult.ok)
            throw new Error(
              stockIncreaseResult.error ??
                "Não foi possível atualizar o estoque de um produto"
            );
        }

        for (const { productId, quantity } of order.products) {
          const stockDecreaseResult = await this.stockRepo.decrease(
            { productId, quantity },
            transaction
          );

          if (!stockDecreaseResult.ok)
            throw new Error(
              stockDecreaseResult.error ??
                "Não foi possível atualizar o estoque de um produto"
            );
        }

        const orderProductsReplaceResult = await this.orderProductRepo.replace(
          id,
          order.products,
          transaction
        );

        if (!orderProductsReplaceResult.ok)
          throw new Error(
            orderProductsReplaceResult.error ??
              "Não foi possível salvar os produtos do pedido"
          );

        return orderUpdateResult;
      });

      return updateResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }
}
