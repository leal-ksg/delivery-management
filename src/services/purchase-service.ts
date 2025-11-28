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
    purchase: CreatePurchaseDTO,
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
        const purchaseCreationResult = await this.purchaseRepo.create(
          newPurchase.userId,
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
    order: UpdatePurchaseDTO
  ): Promise<Result<Purchase>> {
    throw new Error("Method not implemented.");
  }
}
