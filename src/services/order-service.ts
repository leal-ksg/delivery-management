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

      const product = productResult.body;

      const checkStockResult = await this.checkProductStock(
        orderProduct.productId,
        orderProduct.quantity,
        orderId
      );

      if (!checkStockResult.ok)
        return { succeed: false, message: checkStockResult.error };

      if (!checkStockResult.body?.available) {
        const message = `O produto ${product.name} não tem estoque suficiente para esse pedido`;
        return { succeed: false, message };
      }
    }

    return { succeed: true, message: null };
  }

  async checkProductStock(
    productId: string,
    orderedQuantity: number,
    orderId?: number
  ): Promise<Result<{ available: boolean }>> {
    const stockResult = await this.stockRepo.findById(productId);

    if (!stockResult.ok) return { ok: false, error: stockResult.error };

    let availableQuantity = stockResult.body?.quantity ?? 0;

    if (orderId) {
      const orderProductResult = await this.orderProductRepo.findById(
        orderId,
        productId
      );

      if (!orderProductResult.ok)
        return { ok: false, error: orderProductResult.error };

      availableQuantity += orderProductResult.body?.quantity ?? 0;
    }

    if (availableQuantity < orderedQuantity)
      return { ok: true, body: { available: false } };

    return { ok: true, body: { available: true } };
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

        const orderProducts: OrderProduct[] = [];

        for (const { productId, quantity } of newOrder.products) {
          orderProducts.push({
            productId,
            quantity,
            orderId: orderResult.body.id,
          });

          const stockResult = await this.stockRepo.decrease(
            { productId, quantity },
            transaction
          );

          if (!stockResult.ok)
            throw new Error(
              stockResult.error ??
                "Não foi possível atualizar o estoque de um produto"
            );
        }

        const orderProductsResult = await this.orderProductRepo.createMany(
          orderProducts,
          transaction
        );

        if (!orderProductsResult.ok)
          throw new Error(
            orderProductsResult.error ??
              "Não foi possível salvar os produtos do pedido"
          );

        return orderResult;
      });

      return creationResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Pedido") };
    }
  }

  async updateOrder(id: number, order: UpdateOrderDTO): Promise<Result<Order>> {
    const validationResult = await this.validate(order, id);

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

        if (!order.products.length) return orderUpdateResult;

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
