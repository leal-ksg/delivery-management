import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { FormInput } from "@/src/components/FormInput";
import { CheckCircle, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { ProductTree } from "@/src/domains/product-tree/types";
import { updateNode } from "@/src/domains/product-tree/services/update-node";
import { FormSearchSelect } from "@/src/components/FormSearchSelect";
import { Option } from "@/src/domains/types";
import { getProducts } from "@/src/domains/product/services/get-products";
import debounce from "lodash.debounce";
import { toast } from "@/components/ui/sonner";

interface UpdateProductFormProps {
  parentId: string | null;
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
      .positive("A quantidade deve ser maior que zero")
      .max(10000, "Quantidade excede o valor máximo (10.000)"),
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

export function UpdateProductTreeForm({
  parentId,
  editingProduct,
  onSuccess,
  onCancel,
}: UpdateProductFormProps) {
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
    if (!parentId) {
      toast("warning", "Produto pai não informado");

      return;
    }

    const { child, childQuantity } = productSchema.parse(data);

    const parsedData = {
      parentId: parentId,
      childId: child.value,
      childQuantity,
    };

    const response = await updateNode(parsedData);

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
              name="child"
              label="Produto filho"
              defaultOptions
              loadOptions={loadProductOptions}
              disabled={!!editingProduct}
            />
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/8 gap-2 lg:flex-row">
          <FormInput
            name="childQuantity"
            label="Quantidade"
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
