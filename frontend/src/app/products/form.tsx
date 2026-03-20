import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { FormInput } from "@/src/components/FormInput";
import { CreateProductDTO, Product } from "@/src/domains/product/types";
import { CheckCircle, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProductFormProps {
  editingProduct: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const createProductSchema = z.object({
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

type FormData = z.input<typeof createProductSchema>;

export function ProductForm({
  editingProduct,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const methods = useForm<FormData>({
    defaultValues: editingProduct ?? undefined,
    resolver: zodResolver(createProductSchema),
  });

  async function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full min-h-90 mt-10 gap-10"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full gap-2 md:flex-row">
          <FormInput name="name" label="Nome" />

          <FormInput name="description" label="Descrição" />
        </div>

        <div className="flex flex-col w-full gap-2 md:flex-row">
          <FormInput
            name="unitPrice"
            label="Preço unitário"
            type="text"
            inputMode="decimal"
          />

          <FormInput
            name="minStock"
            label="Estoque mínimo"
            type="text"
            inputMode="numeric"
          />

          <FormInput
            name="categoryId"
            label="Categoria"
            type="text"
            inputMode="numeric"
          />
        </div>

        <div className="flex self-end mt-10 md:mt-25 gap-2">
          <ActionButton
            onClick={onCancel}
            className="text-white bg-gray-500 hover:bg-gray-400"
            type="submit"
          >
            <span>Cancelar</span>

            <XCircle strokeWidth={3} />
          </ActionButton>

          <ActionButton
            className="text-white bg-green-600 hover:bg-green-500"
            type="submit"
          >
            <span>Confirmar</span>

            <CheckCircle strokeWidth={3} />
          </ActionButton>
        </div>
      </form>
    </FormProvider>
  );
}
