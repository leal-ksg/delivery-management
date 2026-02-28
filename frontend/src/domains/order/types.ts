export enum OrderStatus {
  PENDING,
  IN_PROGRESS,
  READY_FOR_DELIVERY,
  OUT_FOR_DELIVERY,
  DELIVERED,
  CANCELLED,
}

export type Order = {
  customerId    : string;
  comment       : string; 
  status        : OrderStatus
  createdAt     : Date;
  userId        : string;       
}

