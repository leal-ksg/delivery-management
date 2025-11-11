import { Prisma } from "../../generated/prisma/client";

export interface Product {
  id: string;
  active: boolean;
  name: string;
  description: string  | null;
  unitPrice: Prisma.Decimal;
  categoryId: number;
  minStock: number;
  createdAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description: string  | null;
  unitPrice: Prisma.Decimal;
  categoryId: number;
  minStock: number;
}