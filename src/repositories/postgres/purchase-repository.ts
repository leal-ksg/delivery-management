import { Prisma } from "../../../generated/prisma";
import { IPurchaseRepository } from "../../controllers/purchase/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";
import { Purchase } from "../../models/purchase";

export class PurchaseRepository implements IPurchaseRepository {
  async findAll(): Promise<Result<Purchase[]>> {
    try {
      const purchases = await prisma.purchase.findMany();

      return { ok: true, body: purchases };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Compra") };
    }
  }

  async findById(id: number): Promise<Result<Purchase | null>> {
    try {
      const purchase = await prisma.purchase.findUnique({ where: { id } });

      return { ok: true, body: purchase };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Compra") };
    }
  }

  async create(
    userId: string,
    totalAmount: Prisma.Decimal,
    transaction: Prisma.TransactionClient
  ): Promise<Result<Purchase>> {
    try {
      const newPurchase = await transaction.purchase.create({
        data: { userId, totalAmount },
      });

      return { ok: true, body: newPurchase };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Compra") };
    }
  }

  async update(
    id: number,
    purchase: Partial<Purchase>,
    transaction: Prisma.TransactionClient
  ): Promise<Result<Purchase>> {
    try {
      const updatedPurchase = await transaction.purchase.update({
        where: { id },
        data: purchase,
      });

      return { ok: true, body: updatedPurchase };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Compra") };
    }
  }
}
