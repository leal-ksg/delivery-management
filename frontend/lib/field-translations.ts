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
