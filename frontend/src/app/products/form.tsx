import { Input } from "@/components/ui/input";
import ActionButton from "@/src/components/ActionButton";
import { FormInput } from "@/src/components/FormInput";
import { CreateProductDTO, Product } from "@/src/domains/product/types";
import { CheckCircle, XCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";

interface ProductFormProps {
  editingProduct: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({
  editingProduct,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const methods = useForm<CreateProductDTO>({
    defaultValues: { ...editingProduct },
  });

  async function onSubmit(data: CreateProductDTO) {
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
          <FormInput name="unitPrice" label="Preço unitário" type="text" inputMode="decimal" />

          <FormInput name="minStock" label="Estoque mínimo" type="text" inputMode="numeric" />

          <FormInput name="categoryId" label="Categoria" type="text" inputMode="numeric" />
        </div>

        <div className="flex self-end mt-10 md:mt-25 gap-2">
          <ActionButton
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
