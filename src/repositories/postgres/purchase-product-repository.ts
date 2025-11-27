import { Prisma } from "../../../generated/prisma";
import { IPurchaseProductRepository } from "../../controllers/purchase/interfaces";
import { Result } from "../../core/result";
import { PurchaseProduct } from "../../models/purchase";

export class PurchaseProductRepository implements IPurchaseProductRepository {

    async findById(purchaseId: number, productId: string): Promise<Result<PurchaseProduct | null>> {
        throw new Error("Method not implemented.");
    }

    async findMany(orderId: number): Promise<Result<PurchaseProduct[]>> {
        throw new Error("Method not implemented.");
    }

    async createMany(products: PurchaseProduct[], transaction: Prisma.TransactionClient): Promise<Result<void>> {
        throw new Error("Method not implemented.");
    }

    async replace(purchaseId: number, products: PurchaseProduct[], transaction: Prisma.TransactionClient): Promise<Result<void>> {
        throw new Error("Method not implemented.");
    }

}