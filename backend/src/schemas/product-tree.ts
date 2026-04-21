import * as z from "zod";

export const productTreeSchema = z
  .array(
    z
      .object({
        parentId: z.uuid("Informe o produto pai"),
        childId: z.uuid("Informe o produto filho"),
        childQuantity: z.coerce
          .number(
            "Quantidade do produto filho não é um número ou não foi informada",
          )
          .positive("A quantidade deve ser maior que zero"),
        childUnitCost: z.preprocess(
          (value) => (value === null ? 0 : value),
          z.coerce
            .number("Custo unitário inválido")
            .nonnegative("Custo unitário não pode ser negativo"),
        ),
      })
      .refine((data) => data.parentId !== data.childId, {
        message: "Produto não pode ser filho de si mesmo",
        path: ["childId"],
      }),
  )
  .min(1, "Informe pelo menos um filho para compor o produto");
