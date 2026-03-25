import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { FormInput } from "@/src/components/FormInput";
import { CheckCircle, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "@/src/domains/product/services/create-product";
import {
  ConsumptionType,
  Product,
  ProductType,
} from "@/src/domains/product/types";
import { Spinner } from "@/components/ui/spinner";
import {
  consumptionTypeTranslation,
  productTypeTranslation,
} from "@/lib/field-translations";
import { FormSelect } from "@/src/components/FormSelect";
import { getDirtyValues } from "@/lib/get-dirty-values";
import { ApiResponse } from "@/lib/api";
import { updateProduct } from "@/src/domains/product/services/update-product";
import { useEffect } from "react";

interface ProductFormProps {
  editingProduct: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const productSchema = z.object({
  name: z
    .string("Informe o nome do produto")
    .min(1, "Informe o nome do produto"),
  description: z.string("A descrição deve ser texto").nullable(),
  unitPrice: z.coerce
    .number("Informe um preço unitário válido")
    .refine((val) => val !== 0, "Preço obrigatório")
    .nonnegative("O preço unitário não pode ser negativo"),
  categoryId: z.coerce
    .number("O código da categoria deve ser um número")
    .refine((val) => val !== 0, "Informe uma categoria")
    .nonnegative("O código da categoria não pode ser negativo"),
  minStock: z.coerce
    .number("O estoque mínimo deve ser um número")
    .nonnegative("O estoque mínimo não pode ser negativo")
    .default(0),
  consumptionType: z
    .enum(Object.values(ConsumptionType), "Informe um tipo de consumo válido")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  type: z
    .enum(ProductType, "Informe um tipo de produto válido")
    .nullable()
    .or(z.literal("").transform(() => null)),
});

type FormData = z.input<typeof productSchema>;

export function ProductForm({
  editingProduct,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const methods = useForm<FormData>({
    defaultValues: editingProduct
      ? {
          ...editingProduct,
          categoryId: String(editingProduct.categoryId),
        }
      : undefined,
    resolver: zodResolver(productSchema),
  });

  const { formState } = methods;

  const consumptionOptions = Object.values(ConsumptionType).map((value) => ({
    label: consumptionTypeTranslation[value],
    value,
  }));

  const productTypeOptions = Object.values(ProductType).map((value) => ({
    label: productTypeTranslation[value],
    value,
  }));

  async function onSubmit(data: FormData) {
    let response: ApiResponse<Product>;

    if (editingProduct) {
      const { dirtyFields } = formState;
      console.log(dirtyFields);

      const parsedData = productSchema.parse(methods.getValues());
      const dirtyData = getDirtyValues(dirtyFields, parsedData);
      response = await updateProduct(editingProduct.id, dirtyData);
    } else {
      const parsedData = productSchema.parse(data);
      response = await createProduct(parsedData);
    }

    if (response.ok) {
      onSuccess();
    }
  }

  useEffect(() => {
    if (editingProduct) {
      methods.reset({
        ...editingProduct,
        unitPrice: String(editingProduct.unitPrice),
        minStock: String(editingProduct.minStock),
        categoryId: String(editingProduct.categoryId),
      });
    }
  }, [editingProduct, methods]);

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

        <div className="flex flex-col w-2/3 gap-2 md:flex-row">
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
        </div>

        <div className="flex flex-col w-full gap-2 md:flex-row">
          <FormSelect
            options={productTypeOptions}
            name="type"
            label="Tipo do produto"
            defaultValue={ProductType.PURCHASE}
          />

          <FormSelect
            options={consumptionOptions}
            name="consumptionType"
            label="Tipo de consumo"
            defaultValue={ConsumptionType.PRODUCTION}
          />

          <FormSelect
            options={[{ label: "Lasanhas", value: "10" }]}
            name="categoryId"
            label="Categoria"
          />
        </div>

        <div className="flex self-end mt-10 md:mt-25 gap-2">
          <ActionButton
            onClick={onCancel}
            className="text-white bg-gray-500 hover:bg-gray-400 disabled:text-gray-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={formState.isSubmitting}
          >
            <span>Cancelar</span>

            <XCircle strokeWidth={3} />
          </ActionButton>

          <ActionButton
            className="text-white bg-green-600 hover:bg-green-500 disabled:text-green-600 disabled:bg-green-200 disabled:cursor-not-allowed"
            type="submit"
            disabled={formState.isSubmitting}
          >
            <span>Confirmar</span>

            {formState.isSubmitting ? (
              <Spinner />
            ) : (
              <CheckCircle strokeWidth={3} />
            )}
          </ActionButton>
        </div>
      </form>
    </FormProvider>
  );
}
