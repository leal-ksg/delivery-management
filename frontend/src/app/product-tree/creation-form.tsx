import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { FormInput } from "@/src/components/FormInput";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { ProductTree, ProductTreeDTO } from "@/src/domains/product-tree/types";
import { createNodes } from "@/src/domains/product-tree/services/create-product-tree";
import { FormSearchSelect } from "@/src/components/FormSearchSelect";
import { Option } from "@/src/domains/types";
import { getProducts } from "@/src/domains/product/services/get-products";
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button";
import { Checkout } from "./components/checkout";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";

interface ProductFormProps {
  parentId: string | null;
  existingProducts: ProductTree[] | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface ProductTreeOption {
  parentId: string;
  childId: string;
  childQuantity: number;
  child: { id: string; name: string };
}

const productSchema = z.object({
  child: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    "Informe o produto filho",
  ),
  childQuantity: z.coerce
    .number("Informe a quantidade")
    .positive("A quantidade deve ser maior que zero")
    .max(10000, "Quantidade acima do limite de 10.000 unidades"),
  products: z.array(
    z.object({
      parentId: z.string(),
      childId: z.string(),
      childQuantity: z.number(),
      child: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }),
  ),
});

export type FormData = z.input<typeof productSchema>;

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

export function CreationProductTreeForm({
  parentId,
  existingProducts,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      products: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "products",
  });

  async function handleProductSelection(data: FormData) {
    if (!parentId) return;

    const { child } = data;
    const childQuantity = Number(data.childQuantity);

    if (Number.isNaN(childQuantity)) {
      methods.setError("childQuantity", { message: "Quantidade inválida" });
      return;
    }

    if (child.value === parentId) {
      methods.setError("child", {
        message: "Produto filho não pode ser igual ao pai",
      });

      return;
    }

    const alreadyExists = fields.some((p) => p.childId === child.value);

    if (alreadyExists) {
      methods.setError("child", {
        message: "Esse produto já foi adicionado.",
      });

      return;
    }

    const alreadyInTree =
      existingProducts?.some((p) => p.childId === child.value) || false;

    if (alreadyInTree) {
      methods.setError("child", {
        message: "Esse produto já faz parte da árvore",
      });

      return;
    }

    const parsedData: ProductTreeOption = {
      parentId,
      childId: child.value,
      childQuantity,
      child: {
        id: child.value,
        name: child.label,
      },
    };

    append(parsedData);
  }

  async function handleSubmit() {
    const products = methods.getValues("products");

    if (!parentId) {
      toast("warning", "Produto pai não informado");

      return;
    }

    if (!products || !products.length) {
      toast("warning", "Adicione pelo menos um produto");

      return;
    }

    const nodes: ProductTreeDTO[] = products.map((p) => ({
      childId: p.childId,
      parentId: parentId!,
      childQuantity: p.childQuantity,
    }));

    setLoading(true);
    const response = await createNodes(nodes);
    setLoading(false);

    if (response.ok) onSuccess();
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full justify-between min-h-150 2xl:min-h-90 mt-4 2xl:mt-10 gap-10"
        onSubmit={methods.handleSubmit(handleProductSelection)}
      >
        <div
          className={`grid grid-cols-1 mx-auto w-[70%] ${
            fields.length ? "lg:grid-cols-2 w-full" : ""
          } gap-2 2xl:gap-6 2xl:mt- items-start`}
        >
          <div className="bg-white rounded-2xl shadow-sm py-4 px-2 lg:p-6 2xl:pb-20 space-y-6">
            <h2 className="text-lg font-semibold text-gray-700">Seleção</h2>

            <div className="space-y-3">
              <FormSearchSelect
                name="child"
                label="Produto filho"
                defaultOptions
                loadOptions={loadProductOptions}
              />

              <div className="flex flex-col w-full gap-2 lg:flex-row mt-6">
                <FormInput
                  className="md:w-25"
                  name="childQuantity"
                  label="Quantidade"
                  type="text"
                  inputMode="numeric"
                />
              </div>

              <Button className="w-full mt-4 md:w-fit" type="submit">
                <Plus className="mr-2" />
                Adicionar produto
              </Button>
            </div>
          </div>

          {fields.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-2 lg:p-6 flex flex-col max-h-55 2xl:max-h-90">
              <div className="flex justify-between text-gray-700">
                <h2 className="text-lg font-semibold mb-4">
                  Filhos selecionados
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto lg:pr-2 rounded-md">
                <Checkout products={fields} remove={remove} />
              </div>
            </div>
          )}
        </div>

        <div className="flex self-end 2xl:mt-25 gap-2">
          <ActionButton
            onClick={onCancel}
            className="text-white bg-gray-500 hover:bg-gray-400 disabled:text-gray-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <span>Cancelar</span>

            <XCircle strokeWidth={3} />
          </ActionButton>

          <ActionButton
            className="text-white bg-green-600 hover:bg-green-500 disabled:text-green-600 disabled:bg-green-200 disabled:cursor-not-allowed"
            disabled={loading}
            onClick={handleSubmit}
          >
            <span>Confirmar</span>

            {loading ? <Spinner /> : <CheckCircle strokeWidth={3} />}
          </ActionButton>
        </div>
      </form>
    </FormProvider>
  );
}
