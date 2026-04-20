import { ProductType } from "../product/types";

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

type OrderProduct = {
  orderId: number;
  productId: string;
  quantity: number;
  product: {
    name: string;
    unitPrice: number;
    type: ProductType;
  };
};

export type OrderProductDTO = {
  productId: string;
  quantity: number | null | undefined;
};

export type Order = {
  id: number;
  comment: string;
  status: OrderStatus;
  createdAt: Date;
  orderProducts: OrderProduct[];
};

export type CreateOrderDTO = {
  comment?: string | null;
  products: OrderProductDTO[];
};
