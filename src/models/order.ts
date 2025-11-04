import { OrderStatus } from "../../generated/prisma";

export interface Order {
  id: number;
  customerId: string;
  status: OrderStatus;
  createdAt: Date;
  userId: string;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  customerId: string;
  userId: string;
  products: OrderProduct[]
}
