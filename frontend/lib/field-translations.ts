import { OrderStatus } from "@/src/domains/order/types";
import { ConsumptionType, ProductType } from "@/src/domains/product/types";

export const productTypeTranslation: Record<ProductType, string> = {
  PURCHASE: "Comprado",
  SALE: "Vendável",
  PACKAGING: "Embalagem",
};

export const consumptionTypeTranslation: Record<ConsumptionType, string> = {
  PRODUCTION: "Produção",
  SALE: "Venda",
};

export const orderStatusTranslation: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  READY_FOR_DELIVERY: "Pronto para entrega",
  OUT_FOR_DELIVERY: "Saiu para entrega",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};
