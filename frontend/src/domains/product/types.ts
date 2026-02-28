export enum ProductType {
  SALE,
  PURCHASE,
  PACKAGING
}

export enum ConsumptionType {
  PRODUCTION,
  SALE
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
