import * as z from "zod";
import { ConsumptionType, ProductType } from "../../generated/prisma";

export const productSchema = z.object({
  name: z
    .string("Informe o nome do produto")
    .min(1, "Informe o nome do produto"),
  description: z
    .string("A descrição deve ser texto")
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional(),
  unitPrice: z.coerce
    .number("Preço unitário não é um número ou não foi informado")
    .refine((value) => value !== 0, "Preço obrigatório")
    .nonnegative("O preço unitário não pode ser negativo"),
  minStock: z.coerce
    .number("Estoque mínimo não é um número ou não foi informado")
    .nonnegative("O estoque mínimo não pode ser negativo")
    .default(0),
  consumptionType: z
    .enum(Object.values(ConsumptionType), "Informe um tipo de consumo válido")
    .nullable()
    .optional(),
  type: z.enum(ProductType, "Informe um tipo de produto válido").nullable(),
  active: z.boolean().optional().nullable(),
});

export const updateProductSchema = productSchema.partial();

export const deleteProductSchema = z.object({
  ids: z
    .array(z.uuid("ID de produto inválido"))
    .min(1, "Informe pelo menos um produto para a exclusão"),
});
