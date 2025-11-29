import { Prisma } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";
import { PurchaseProduct } from "../../models/purchase";

import {
  CreatePurchaseDTO,
  Purchase,
  UpdatePurchaseDTO,
} from "../../models/purchase";

export interface IPurchaseRepository {
  findAll(): Promise<Result<Purchase[]>>;
  findById(id: number): Promise<Result<Purchase | null>>;
  create(userId: string, totalAmount: Prisma.Decimal, transaction: Prisma.TransactionClient): Promise<Result<Purchase>>;
  update(id: number, purchase: Partial<Purchase>): Promise<Result<Purchase>>;
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
    purchase: CreatePurchaseDTO,
    purchaseId?: number
  ): Promise<{ succeed: boolean; message: string | null }>;
  createPurchase(newPurchase: CreatePurchaseDTO): Promise<Result<Purchase>>;
  updatePurchase(
    id: number,
    order: UpdatePurchaseDTO
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