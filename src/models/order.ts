import { OrderStatus } from "../../generated/prisma";

export interface Order {
  id: number;
  comment: string | null;
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
  comment: string | null;
  products: OrderProduct[];
}

export interface UpdateOrderDTO extends Omit<Order, "createdAt"> {
  products: OrderProduct[];
}
