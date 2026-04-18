import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/src/domains/product/types";
import { Spinner } from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/get-dirty-values";
import { ApiResponse } from "@/lib/api";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { Order, OrderProductDTO, OrderStatus } from "@/src/domains/order/types";
import { updateOrder } from "@/src/domains/order/services/update-order";
import { createOrder } from "@/src/domains/order/services/create-order";
import { FormInput } from "@/src/components/FormInput";
import { useSearch } from "@/hooks/use-search";
import { getProducts } from "@/src/domains/product/services/get-products";
import { Option } from "@/src/domains/types";
import debounce from "lodash.debounce";
import { SearchSelect } from "@/src/components/SearchSelect";
import { Button } from "@/components/ui/button";
import { Checkout } from "./components/checkout";

interface OrderFormProps {
  editingOrder: Order | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface ProductOptionValue {
  name: string;
  id: string;
  unitPrice: number;
  quantity?: number;
}

const orderSchema = z.object({
  customerId: z.uuid("Informe o cliente"),
  userId: z.uuid().nullable().optional(),
  comment: z.string().nullable().optional(),
  selectedProduct: z
    .object({
      label: z.string(),
      value: z.object({
        name: z.string(),
        id: z.uuid(),
        unitPrice: z.number(),
      }),
    })
    .nullable()
    .optional(),
  status: z.enum(OrderStatus, "Informe um status válido"),
});

type FormData = z.input<typeof orderSchema>;

const fetchProducts = async (
  inputValue: string,
): Promise<Option<ProductOptionValue>[]> => {
  const response = await getProducts(inputValue, 0, 20);

  if (!response.ok) {
    return [];
  }

  return response.body.list.map((p) => ({
    label: p.name,
    value: { name: p.name, id: p.id, unitPrice: p.unitPrice },
  }));
};

const debouncedFetch = debounce(
  (
    inputValue: string,
    resolve: (value: Option<ProductOptionValue>[]) => void,
  ) => {
    fetchProducts(inputValue).then(resolve);
  },
  1000,
);

const loadProductOptions = (
  inputValue: string,
): Promise<Option<ProductOptionValue>[]> => {
  return new Promise((resolve) => {
    debouncedFetch(inputValue, resolve);
  });
};

export function OrderForm({
  editingOrder,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const methods = useForm<FormData>({
    defaultValues: editingOrder ?? undefined,
    resolver: zodResolver(orderSchema),
  });
  const [selectedProducts, setSelectedProducts] = useState<
    ProductOptionValue[]
  >([]);

  const { formState, setValue } = methods;

  const handleProductSelection = useCallback(() => {
    const selectedProduct = methods.getValues("selectedProduct");

    if (!selectedProduct) return;

    console.log(selectedProduct);

    const alreadyIncluded = selectedProducts.some((p) => {
      return p.id === selectedProduct.value.id;
    });

    if (alreadyIncluded) return;

    console.log(3);
    setSelectedProducts((prev) => [...prev, selectedProduct.value]);

    // console.log(4);
    setValue("selectedProduct", null);
  }, [methods, selectedProducts, setValue]);

  async function onSubmit(data: FormData) {
    let response: ApiResponse<Product>;

    if (editingOrder) {
      const { dirtyFields } = formState;

      const parsedData = orderSchema.parse(methods.getValues());
      const dirtyData = getDirtyValues(dirtyFields, parsedData);
      // response = await updateOrder(editingOrder.id, dirtyData);
    } else {
      const parsedData = orderSchema.parse(data);
      // response = await createOrder(parsedData);
    }

    // if (response.ok) {
    //   onSuccess();
    // }
  }

  useEffect(() => {
    // console.log(selectedProducts);
  }, [selectedProducts]);

  useEffect(() => {
    if (editingOrder) {
      methods.reset(editingOrder);
    }
  }, [editingOrder, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto lg:p-6 space-y-6"
      >
        <div
          className={`grid grid-cols-1 ${selectedProducts && selectedProducts.length ? "lg:grid-cols-2" : ""} gap-2 lg:gap-6 lg:mt-30 items-start`}
        >
          <div className="bg-white rounded-2xl shadow-sm py-4 px-2 lg:p-6 lg:pb-20 space-y-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Dados do Pedido
            </h2>

            <FormInput name="comment" label="Comentário" optional />

            <div className="space-y-3">
              <SearchSelect
                name="selectedProduct"
                label="Buscar produto"
                defaultOptions
                loadOptions={loadProductOptions}
              />

              <Button
                onClick={handleProductSelection}
                type="button"
                className="w-full md:w-fit"
              >
                <Plus className="mr-2" />
                Adicionar produto
              </Button>
            </div>
          </div>

          {selectedProducts && selectedProducts.length !== 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-2 lg:p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Produtos do Pedido
              </h2>

              <div className="flex-1 overflow-y-auto lg:pr-2">
                <Checkout
                  products={selectedProducts}
                  updateProducts={setSelectedProducts}
                />
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2 lg:pt-4 border-t border-gray-300">
          <ActionButton
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-400 text-white"
            disabled={formState.isSubmitting}
          >
            <span>Cancelar</span>
            <XCircle strokeWidth={3} />
          </ActionButton>

          <ActionButton
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white"
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
