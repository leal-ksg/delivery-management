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
  type: ProductType;
  consumptionType: ConsumptionType;
  minStock: number;
  category: string;
  createdAt: Date;
  stockQuantity: number;
};

export type CreateProductDTO = {
  name: string;
  description: string | null;
  unitPrice: number;
  minStock: number;
  type?: ProductType | null;
  consumptionType?: ConsumptionType | null;
  stockQuantity?: number | null;
};

export type UpdateProductDTO = Partial<Product> & {
  stockQuantity?: number | null;
};
