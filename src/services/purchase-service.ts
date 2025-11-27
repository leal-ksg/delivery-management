import {
  IPurchaseRepository,
  IPurchaseService,
} from "../controllers/purchase/interfaces";
import { IUserRepository } from "../controllers/user/interfaces";
import { Result } from "../core/result";
import { prisma } from "../database/prisma";
import {
  CreatePurchaseDTO,
  Purchase,
  UpdatePurchaseDTO,
} from "../models/purchase";

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly purchaseRepo: IPurchaseRepository
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

    const creationResult = await prisma.$transaction(async (transaction) => {
      const purchaseCreationResult = await this.purchaseRepo.create(
        newPurchase.userId,
        transaction
      );

      if (!purchaseCreationResult.ok) return purchaseCreationResult;

      for (const product of newPurchase.products) {
        // const purchaseProductResult = await this
      }


      return purchaseCreationResult;
    });

    return creationResult;
  }

  async updatePurchase(
    id: number,
    order: UpdatePurchaseDTO
  ): Promise<Result<Purchase>> {
    throw new Error("Method not implemented.");
  }
}
