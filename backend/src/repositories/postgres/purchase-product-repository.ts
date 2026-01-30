import { Prisma } from "../../../generated/prisma";
import { IPurchaseProductRepository } from "../../controllers/purchase/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";
import { PurchaseProduct } from "../../models/purchase";

export class PurchaseProductRepository implements IPurchaseProductRepository {
  async findById(
    purchaseId: number,
    productId: string
  ): Promise<Result<PurchaseProduct | null>> {
    try {
      const purchaseProduct = await prisma.purchaseProduct.findUnique({
        where: { purchaseId_productId: { productId, purchaseId } },
      });

      return { ok: true, body: purchaseProduct };
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Produto da compra"),
      };
    }
  }

  async findMany(purchaseId: number): Promise<Result<PurchaseProduct[]>> {
    try {
      const purchaseProducts = await prisma.purchaseProduct.findMany({
        where: { purchaseId },
      });

      return { ok: true, body: purchaseProducts };
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Produto da compra"),
      };
    }
  }

  async createMany(
    products: PurchaseProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>> {
    try {
      await transaction.purchaseProduct.createMany({
        data: products,
      });

      return { ok: true, body: undefined };
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Produto da compra"),
      };
    }
  }

  async replace(
    purchaseId: number,
    products: PurchaseProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>> {
    try {
      await transaction.purchaseProduct.deleteMany({ where: { purchaseId } });

      await transaction.purchaseProduct.createMany({ data: products });

      return {ok: true, body: undefined}
    } catch (err) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(err, "Produto da compra"),
      };
    }
  }
}
