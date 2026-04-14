import ActionButton from "@/src/components/ActionButton";
import * as z from "zod";
import { CheckCircle, Plus, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useEffect, useState } from "react";
import { Order, OrderProductDTO, OrderStatus } from "@/src/domains/order/types";
import { updateOrder } from "@/src/domains/order/services/update-order";
import { createOrder } from "@/src/domains/order/services/create-order";
import { FormInput } from "@/src/components/FormInput";
import { Input } from "@/components/ui/input";

interface OrderFormProps {
  editingOrder: Order | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const orderSchema = z.object({
  customerId: z.uuid("Informe o cliente"),
  userId: z.uuid().nullable().optional(),
  comment: z.string().nullable().optional(),
  status: z.enum(OrderStatus, "Informe um status válido"),
});

type FormData = z.input<typeof orderSchema>;

export function OrderForm({
  editingOrder,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const methods = useForm<FormData>({
    defaultValues: editingOrder ?? undefined,
    resolver: zodResolver(orderSchema),
  });
  const [products, setProducts] = useState<OrderProductDTO[]>([]);

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

    if (editingOrder) {
      const { dirtyFields } = formState;
      console.log(dirtyFields);

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
    if (editingOrder) {
      methods.reset(editingOrder);
    }
  }, [editingOrder, methods]);

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full min-h-90 mt-10 gap-10"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-1/2 gap-2 md:flex-row">
          {/* TODO: add async logic to fetch users */}
          <FormSelect
            options={productTypeOptions}
            name="customerId"
            label="Cliente"
          />
        </div>

        <div className="flex flex-col w-full gap-2 md:flex-row">
          <FormInput name="comment" label="Comentário" />
        </div>

        <div className="flex flex-col w-full mt-5 gap-2">
          <h2 className="text-xl font-semibold text-stone-600">Produtos</h2>

          <div className="flex items-center gap-3">
            <Input className="max-w-1/2" />
            <ActionButton
              className="bg-secondary text-white hover:bg-secondary/65"
              icon={Plus}
            ></ActionButton>
          </div>

          <div className="flex flex-col gap-1 w-1/2 mt-5 overflow-y-scroll">
            
            {/* Products list goes here */}
          </div>
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
