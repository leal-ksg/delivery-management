import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/get-dirty-values";
import { ApiResponse } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { Order, OrderStatus } from "@/src/domains/order/types";
import { updateOrder } from "@/src/domains/order/services/update-order";
import { createOrder } from "@/src/domains/order/services/create-order";
import { FormInput } from "@/src/components/FormInput";
import { getProducts } from "@/src/domains/product/services/get-products";
import { Option } from "@/src/domains/types";
import debounce from "lodash.debounce";
import { FormSearchSelect } from "@/src/components/FormSearchSelect";
import { Button } from "@/components/ui/button";
import { Checkout } from "./components/checkout";
import { toast } from "@/components/ui/sonner";

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
  status: z.enum(OrderStatus, "Informe um status válido").nullable().optional(),
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

const mapOrderProducts = (order: Order | null): ProductOptionValue[] => {
  if (!order) return [];

  return order.orderProducts.map((p) => ({
    name: p.product.name,
    id: p.productId,
    unitPrice: p.product.unitPrice,
    quantity: p.quantity,
  }));
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
  >(mapOrderProducts(editingOrder));

  const { formState, setValue } = methods;

  const handleProductSelection = useCallback(() => {
    const selectedProduct = methods.getValues("selectedProduct");

    if (!selectedProduct) return;

    const alreadyIncluded = selectedProducts.some((p) => {
      return p.id === selectedProduct.value.id;
    });

    if (alreadyIncluded) return;

    setSelectedProducts((prev) => [
      ...prev,
      { ...selectedProduct.value, quantity: 1 },
    ]);

    setValue("selectedProduct", null);
  }, [methods, selectedProducts, setValue]);

  function validateProducts() {
    if (!selectedProducts || !selectedProducts.length)
      return "Selecione os produtos vendidos";

    if (selectedProducts.some((p) => !p.quantity))
      return "Há um produto sem quantidade informada";

    return null;
  }

  function mapOrderData(data: FormData) {
    const products = selectedProducts.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
    }));

    return {
      comment: data.comment,
      products,
    };
  }

  async function onSubmit(data: FormData) {
    let response: ApiResponse<Order>;

    const productValidationError = validateProducts();

    if (productValidationError) {
      toast("error", productValidationError);
      return;
    }

    if (editingOrder) {
      const { dirtyFields } = formState;

      const parsedData = orderSchema.parse(methods.getValues());
      const dirtyData = getDirtyValues(dirtyFields, parsedData);

      const mappedProducts = selectedProducts.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
      }));

      response = await updateOrder(editingOrder.id, {
        ...dirtyData,
        products: mappedProducts,
      });
    } else {
      const parsedData = mapOrderData(orderSchema.parse(data));
      console.log(parsedData);
      response = await createOrder(parsedData);
    }

    if (response.ok) {
      onSuccess();
    }
  }

  useEffect(() => {
    if (editingOrder) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { orderProducts, ...order } = editingOrder;

      methods.reset(order);
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
              <FormSearchSelect
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
              <div className="flex justify-between text-gray-700">
                <h2 className="text-lg font-semibold mb-4">
                  Produtos do Pedido
                </h2>

                {selectedProducts && selectedProducts.length > 0 && (
                  <span>
                    Total:
                    {selectedProducts
                      .reduce(
                        (acc, v) => acc + (v.quantity ?? 0) * v.unitPrice,
                        0,
                      )
                      .toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </span>
                )}
              </div>

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
        <div className="flex justify-end gap-3 pt-2 lg:pt-4">
          <ActionButton
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-400 text-white disabled:text-white"
            disabled={formState.isSubmitting}
          >
            <span>Cancelar</span>
            <XCircle strokeWidth={3} />
          </ActionButton>

          <ActionButton
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white disabled:text-white"
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
