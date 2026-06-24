export enum ProductType {
  PURCHASE = "PURCHASE",
  SALE = "SALE",
  PACKAGING = "PACKAGING",
  SERVICE = "SERVICE",
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
  totalCost: number;
  unitPrice: number;
  profitMargin: number;
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
  profitMargin: number;
  minStock: number;
  type?: ProductType | null;
  consumptionType?: ConsumptionType | null;
  stockQuantity?: number | null;
};

export type UpdateProductDTO = Partial<Product> & {
  stockQuantity?: number | null;
};

export interface ProductFilterForm {
  active?: "true" | "false" | "all";
  type?: ProductType | "all";
  stock?: "above" | "below" | "all";
};

export interface ProductFilter {
  active?: boolean;
  type?: ProductType;
  stock?: "above" | "below";
};