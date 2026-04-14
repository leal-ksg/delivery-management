import { Customer } from "../customer/types";
import { ProductType } from "../product/types";
import { User } from "../user/types";

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

type OrderProduct = {
  quantity: number;
  product: {
    id: string;
    name: string;
    unitPrice: number;
    type: ProductType;
  };
};

export type OrderProductDTO = {
  id: string;
  quantity: number;
};

export type Order = {
  id: number;
  comment: string;
  customer: Customer;
  status: OrderStatus;
  createdAt: Date;
  orderProducts: OrderProduct[];
  totalAmount: number;
  userId: string;
  user: User;
};

export type CreateOrderDTO = {
  customerId: string;
  userId: string;
  comment?: string | null;
  status?: OrderStatus | null;
  createdAt: Date;
  products: OrderProductDTO[];
};
