export enum ProductType {
  PURCHASE = "PURCHASE",
  SALE = "SALE",
  PACKAGING = "PACKAGING",
}

export enum ConsumptionType {
  PRODUCTION = "PRODUCTION",
  SALE = "SALE",
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
};

export type CreateProductDTO = {
  name: string;
  description: string | null;
  unitPrice: number;
  categoryId: number;
  minStock: number;
};
