import { Prisma, Purchase, PurchaseProduct } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";

export interface CreatePurchaseDTO {
  userId: string;
  products: Omit<PurchaseProduct, "purchaseId">[];
}

export interface UpdatePurchaseDTO extends Partial<Omit<Purchase, "createdAt" >> {
  products?: PurchaseProduct[];
}

export interface IPurchaseRepository {
  findAll(): Promise<Result<Purchase[]>>;
  findById(id: number): Promise<Result<Purchase | null>>;
  create(userId: string, totalAmount: Prisma.Decimal, transaction: Prisma.TransactionClient): Promise<Result<Purchase>>;
  update(id: number, purchase: Partial<Purchase>, transaction: Prisma.TransactionClient): Promise<Result<Purchase>>;
}

export interface IPurchaseController {
  getAllPurchases(): Promise<HttpResponse<Purchase[]>>;
  getPurchaseById(id: number): Promise<HttpResponse<Purchase | null>>;
  createPurchase(purchase: CreatePurchaseDTO): Promise<HttpResponse<Purchase>>;
  updatePurchase(
    id: number,
    purchase: Partial<Purchase>
  ): Promise<HttpResponse<Purchase>>;
  cancelPurchase(id: number): Promise<HttpResponse<Purchase>>;
}

export interface IPurchaseService {
  validate(
    purchase: CreatePurchaseDTO | UpdatePurchaseDTO,
    purchaseId?: number
  ): Promise<{ succeed: boolean; message: string | null }>;
  createPurchase(newPurchase: CreatePurchaseDTO): Promise<Result<Purchase>>;
  updatePurchase(
    id: number,
    purchase: UpdatePurchaseDTO
  ): Promise<Result<Purchase>>;
}

export interface IPurchaseProductRepository {
  findById(
    purchaseId: number,
    productId: string
  ): Promise<Result<PurchaseProduct | null>>;
  findMany(purchaseId: number): Promise<Result<PurchaseProduct[]>>;
  createMany(
    products: PurchaseProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>>;
  replace(
    purchaseId: number,
    products: PurchaseProduct[],
    transaction: Prisma.TransactionClient
  ): Promise<Result<void>>;
}