import { Prisma } from "../../generated/prisma";
import {
  IPurchaseProductRepository,
  IPurchaseRepository,
  IPurchaseService,
} from "../controllers/purchase/interfaces";
import { IStockRepository } from "../controllers/stock/interfaces";
import { IUserRepository } from "../controllers/user/interfaces";
import { parseDatabaseErrorMessage } from "../core/parse-database-error-message";
import { Result } from "../core/result";
import { prisma } from "../database/prisma";
import {
  CreatePurchaseDTO,
  Purchase,
  PurchaseProduct,
  UpdatePurchaseDTO,
} from "../models/purchase";

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly purchaseRepo: IPurchaseRepository,
    private readonly purchaseProductRepo: IPurchaseProductRepository,
    private readonly stockRepo: IStockRepository
  ) {}

  async validate(
    purchase: CreatePurchaseDTO | UpdatePurchaseDTO,
    purchaseId?: number
  ): Promise<{ succeed: boolean; message: string | null }> {
    if (purchase.userId) {
      const userResult = await this.userRepo.findById(purchase.userId!);

      if (!userResult.ok) return { succeed: false, message: userResult.error };

      if (!userResult.body)
        return {
          succeed: false,
          message: "Usuário não encontrado para finalizar a compra",
        };
    }

    if (purchaseId) {
      const purchaseResult = await this.purchaseRepo.findById(purchaseId);

      if (!purchaseResult.ok)
        return { succeed: false, message: purchaseResult.error };

      if (!purchaseResult.body)
        return {
          succeed: false,
          message: "Compra não encontrada para atualização",
        };
    }

    return { succeed: true, message: null };
  }

  async createPurchase(
    newPurchase: CreatePurchaseDTO
  ): Promise<Result<Purchase>> {
    const validationResult = await this.validate(newPurchase);

    if (!validationResult.succeed)
      return { ok: false, error: validationResult.message! };

    try {
      const creationResult = await prisma.$transaction(async (transaction) => {
        const totalAmount = newPurchase.products.reduce(
          (acm: Prisma.Decimal, product) => acm.plus(product.unitPrice),
          new Prisma.Decimal(0)
        );

        const purchaseCreationResult = await this.purchaseRepo.create(
          newPurchase.userId,
          totalAmount,
          transaction
        );

        if (!purchaseCreationResult.ok)
          throw new Error(
            purchaseCreationResult.error ??
              "Não foi possível registrar a compra"
          );

        const products: PurchaseProduct[] = [];

        for (const product of newPurchase.products) {
          products.push({
            purchaseId: purchaseCreationResult.body.id,
            ...product,
          });

          const stockResult = await this.stockRepo.increase(
            {
              productId: product.productId,
              quantity: product.quantity,
            },
            transaction
          );

          if (!stockResult.ok)
            throw new Error(
              stockResult.error ??
                "Não foi possível atualizar o estoque de um item da compra"
            );
        }

        const productsCreationResult =
          await this.purchaseProductRepo.createMany(products, transaction);

        if (!productsCreationResult.ok)
          throw new Error(
            productsCreationResult.error ??
              "Não foi possível gravar um produto da compra"
          );

        return purchaseCreationResult;
      });

      return creationResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Compra") };
    }
  }

  async updatePurchase(
    id: number,
    purchase: UpdatePurchaseDTO
  ): Promise<Result<Purchase>> {
    const validationResult = await this.validate(purchase, id);

    if (!validationResult.succeed)
      return { ok: false, error: validationResult.message! };

    try {
      const updateResult = await prisma.$transaction(async (transaction) => {
        const purchaseResult = await this.purchaseRepo.update(
          id,
          purchase,
          transaction
        );

        if (!purchaseResult.ok)
          throw new Error(
            purchaseResult.error ?? "Não foi possível atualizar a compra"
          );

        if (purchase.products && purchase.products.length) {
          const oldPurchaseProductsResult =
            await this.purchaseProductRepo.findMany(id);

          if (!oldPurchaseProductsResult.ok)
            throw new Error(
              oldPurchaseProductsResult.error ??
                "Não foi possível estornar os produtos comprados anteriormente"
            );

          for (const oldProduct of oldPurchaseProductsResult.body) {
            const stockDecreaseResult = await this.stockRepo.decrease(
              {
                productId: oldProduct.productId,
                quantity: oldProduct.quantity,
              },
              transaction
            );

            if (!stockDecreaseResult.ok)
              throw new Error(
                stockDecreaseResult.error ??
                  "Não foi possível estornar os produtos comprados anteriormente"
              );
          }

          for (const product of purchase.products) {
            const stockResult = await this.stockRepo.increase(
              {
                productId: product.productId,
                quantity: product.quantity,
              },
              transaction
            );

            if (!stockResult.ok)
              throw new Error(
                stockResult.error ??
                  "Não foi possível atualizar o estoque de um item da compra"
              );
          }

          const newPurchaseProductsResult = await this.purchaseProductRepo.replace(id, purchase.products, transaction)
          
          if (!newPurchaseProductsResult.ok)
              throw new Error(
                newPurchaseProductsResult.error ??
                  "Não foi possível atualizar os itens da compra"
              );
        }

        return purchaseResult;
      });

      return updateResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Compra") };
    }
  }
}
