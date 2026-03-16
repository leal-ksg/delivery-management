import * as z from "zod";

export const createProductSchema = z.object({
  name: z.string("Informe o nome do produto"),
  description: z.string("A descrição deve ser texto").nullable(),
  unitPrice: z.coerce
    .number("Informe um preço unitário válido")
    .nonnegative("O preço unitário não pode ser negativo"),
  categoryId: z.coerce
    .number("O código da categoria deve ser um número")
    .positive("O código da categoria não pode ser negativo"),
  minStock: z.coerce
    .number("O estoque mínimo deve ser um número")
    .nonnegative("O estoque mínimo não pode ser negativo"),
});
