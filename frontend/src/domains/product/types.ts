export enum ProductType {
  SALE = "SALE",
  PURCHASE = "PURCHASE",
  PACKAGING = "PACKAGING",
}

export enum ConsumptionType {
  PRODUCTION,
  SALE,
}

export type Product = {
  id: string;
  active: boolean;
  name: string;
  description: string;
  unitPrice: number;
  categoryId: number;
  type: ProductType;
  consumptionType: ConsumptionType;
  minStock: number;
  category: string;
  createdAt: Date;
  status?: string;
};

export type CreateProductDTO = {
  name: string;
  description: string | null;
  unitPrice: number;
  categoryId: number;
  minStock: number;
};
