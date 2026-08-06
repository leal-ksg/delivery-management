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
import { FormSwitch } from "@/src/components/FormSwitch";
import { FormNumericInput } from "@/src/components/FormNumericInput";

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
    .max(99999999, "Preço excede os limites")
    .nonnegative("O preço unitário não pode ser negativo"),

  profitMargin: z.coerce
    .number("Informe uma margem válida")
    .min(0, "A margem não pode ser negativa")
    .max(9999, "Margem excede os limites"),

  minStock: z.coerce
    .number("O estoque mínimo deve ser um número")
    .nonnegative("O estoque mínimo não pode ser negativo")
    .max(9999999999, "Estoque mínimo excede os limites")
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

  stockQuantity: z.coerce
    .number("Quantidade em estoque deve ser um número")
    .nonnegative("Quantidade em estoque não pode ser negativa")
    .max(9999999999, "Estoque excede os limites")
    .optional()
    .nullable(),

  active: z.boolean().nullable().optional(),
});

type FormData = z.input<typeof productSchema>;

export function ProductForm({
  editingProduct,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const methods = useForm<FormData>({
    defaultValues: editingProduct
      ? ({
          ...editingProduct,
          profitMargin: (Number(editingProduct.profitMargin) - 1) * 100,
        } as FormData)
      : {
          type: ProductType.PURCHASE,
          consumptionType: ConsumptionType.SALE,
          profitMargin: 0,
          minStock: 0,
          active: true,
        },
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

    const parsedData = productSchema.parse(data);

    const mappedData = {
      ...parsedData,
      profitMargin: 1 + parsedData.profitMargin / 100,
    };

    if (editingProduct) {
      const { dirtyFields } = formState;

      const dirtyData = getDirtyValues(dirtyFields, mappedData);

      response = await updateProduct(editingProduct.id, dirtyData);
    } else {
      response = await createProduct(mappedData);
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
        profitMargin: String((Number(editingProduct.profitMargin) - 1) * 100),
        minStock: String(editingProduct.minStock),
        stockQuantity: String(editingProduct.stockQuantity),
      } as FormData);
    } else {
      methods.reset({
        type: ProductType.PURCHASE,
        consumptionType: ConsumptionType.SALE,
        profitMargin: 0,
        minStock: 0,
        active: true,
      });
    }
  }, [editingProduct, methods]);

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full min-h-90 mt-10 gap-10"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full gap-2 lg:flex-row">
          <FormInput name="name" label="Nome" />

          <FormInput name="description" label="Descrição" optional />

          <FormSwitch
            name="active"
            label="Ativo?"
            classname="md:ml-4 self-end lg:self-center"
            disabled={!editingProduct}
            defaultValue={true}
          />
        </div>

        <div className="flex flex-col w-full gap-2 lg:flex-row">
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
            defaultValue={ConsumptionType.SALE}
          />
        </div>

        <div className="flex flex-col w-1/2 gap-2 lg:flex-row">
          <FormNumericInput
            name="unitPrice"
            label="Preço site"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
          />

          <FormNumericInput
            name="profitMargin"
            label="Margem de lucro (%)"
            thousandSeparator="."
            decimalSeparator=","
            suffix="%"
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
          />

          <FormInput
            name="minStock"
            label="Estoque mínimo"
            type="text"
            inputMode="numeric"
          />

          <FormInput
            name="stockQuantity"
            label="Estoque atual"
            type="text"
            inputMode="numeric"
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
