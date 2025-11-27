import { PurchaseStatus, UnitMeasure } from "../../generated/prisma";
import { Prisma } from "../../generated/prisma/client";

export interface Purchase {
  id: number;
  createdAt: Date;
  userId: string;
  status: PurchaseStatus;
  totalAmount: Prisma.Decimal;
}

export interface PurchaseProduct {
  purchaseId: number;
  productId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  unitMeasure: UnitMeasure;
}

export interface CreatePurchaseDTO {
  userId: string;
  products: Omit<PurchaseProduct, "purchaseId">[];
}

export interface UpdatePurchaseDTO extends Partial<Omit<Purchase, "createdAt" >> {
  products?: PurchaseProduct[];
}
