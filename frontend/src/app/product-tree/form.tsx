import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { FormInput } from "@/src/components/FormInput";
import { CheckCircle, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/get-dirty-values";
import { ApiResponse } from "@/lib/api";
import { useEffect } from "react";
import { FormNumericInput } from "@/src/components/FormNumericInput";
import { ProductTree, ProductTreeDTO } from "@/src/domains/product-tree/types";
import { createNode } from "@/src/domains/product-tree/services/create-product-tree";
import { updateNode } from "@/src/domains/product-tree/services/update-node";
import { FormSearchSelect } from "@/src/components/FormSearchSelect";
import { Option } from "@/src/domains/types";
import { getProducts } from "@/src/domains/product/services/get-products";
import debounce from "lodash.debounce";

interface ProductFormProps {
  editingProduct: ProductTree | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const productSchema = z
  .object({
    parent: z.object({
      label: z.string(),
      value: z.string("Informe o produto pai"),
    }),
    child: z.object({
      label: z.string(),
      value: z.string("Informe o produto filho"),
    }),
    childQuantity: z.coerce
      .number("Informe a quantidade do produto filho")
      .positive("A quantidade deve ser maior que zero"),
    childUnitCost: z.preprocess(
      (value) => (value === null ? 0 : value),
      z.coerce
        .number("Custo unitário inválido")
        .nonnegative("Custo unitário não pode ser negativo"),
    ),
  })
  .refine((data) => data.parent.value !== data.child.value, {
    message: "Produto não pode ser filho de si mesmo",
    path: ["childId"],
  });

type FormData = z.input<typeof productSchema>;

const fetchProducts = async (inputValue: string): Promise<Option<string>[]> => {
  const response = await getProducts(inputValue, 0, 20);

  if (!response.ok) {
    return [];
  }

  return response.body.list.map((p) => ({
    label: p.name,
    value: p.id,
  }));
};

const loadProductOptions = (inputValue: string): Promise<Option<string>[]> => {
  const debouncedFetch = debounce(
    (inputValue: string, resolve: (value: Option<string>[]) => void) => {
      fetchProducts(inputValue).then(resolve);
    },
    1000,
  );

  return new Promise((resolve) => {
    debouncedFetch(inputValue, resolve);
  });
};

export function ProductTreeForm({
  editingProduct,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const methods = useForm<FormData>({
    defaultValues: editingProduct
      ? {
          ...editingProduct,
          parent: {
            label: editingProduct?.parent?.name,
            value: editingProduct?.parent?.id,
          },
          child: {
            label: editingProduct?.child?.name,
            value: editingProduct?.child?.id,
          },
        }
      : undefined,
    resolver: zodResolver(productSchema),
  });

  const { formState } = methods;

  async function onSubmit(data: FormData) {
    console.log("submit");
    let response: ApiResponse<ProductTreeDTO>;

    const { child, parent, childQuantity, childUnitCost } =
      productSchema.parse(data);

    const parsedData = {
      parentId: parent.value,
      childId: child.value,
      childQuantity,
      childUnitCost,
    };

    if (editingProduct) {
      response = await updateNode(parsedData);
    } else {
      response = await createNode(parsedData);
    }

    if (response.ok) {
      onSuccess();
    }
  }

  useEffect(() => {
    if (editingProduct) {
      methods.reset({
        ...editingProduct,
        parent: {
          label: editingProduct?.parent?.name,
          value: editingProduct?.parent?.id,
        },
        child: {
          label: editingProduct?.child?.name,
          value: editingProduct?.child?.id,
        },
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
          <div className="w-full md:w-1/2">
            <FormSearchSelect
              name="parent"
              label="Produto pai"
              defaultOptions
              loadOptions={loadProductOptions}
              disabled={!!editingProduct}
            />
          </div>

          <div className="w-full md:w-1/2">
            <FormSearchSelect
              name="child"
              label="Produto filho"
              defaultOptions
              loadOptions={loadProductOptions}
              disabled={!!editingProduct}
            />
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/2 gap-2 lg:flex-row">
          <FormInput
            name="childQuantity"
            label="Quantidade"
            type="text"
            inputMode="numeric"
          />

          <FormNumericInput
            name="childUnitCost"
            label="Custo unitário"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
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
