import { productTypeTranslation } from "@/lib/field-translations";
import ActionButton from "@/src/components/ActionButton";
import { FormSelect } from "@/src/components/FormSelect";
import {
  ProductFilter,
  ProductFilterForm,
  ProductType,
} from "@/src/domains/product/types";
import { Filter } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface ProductFiltersProps {
  onFiltersChange: Dispatch<SetStateAction<ProductFilter>>;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const methods = useForm();

  const statusOptions = [
    {
      label: "Todos",
      value: "all",
    },
    {
      label: "Ativo",
      value: "true",
    },
    {
      label: "Inativo",
      value: "false",
    },
  ];

  const stockOptions = [
    {
      label: "Todos",
      value: "all",
    },
    {
      label: "Abaixo do mínimo",
      value: "below",
    },
    {
      label: "Acima do mínimo",
      value: "above",
    },
  ];

  const productTypeOptions = [
    { label: "Todos", value: "all" },
    ...Object.values(ProductType).map((value) => ({
      label: productTypeTranslation[value],
      value,
    })),
  ];

  function onSubmit(data: ProductFilterForm) {
    onFiltersChange({
      active:
        data.active === "all" || !data.active
          ? undefined
          : data.active === "true",
      type: data.type === "all" || !data.active ? undefined : data.type,
      stock: data.stock === "all" || !data.active ? undefined : data.stock,
    });

  }

  return (
    <div className="w-[80%]  bg-white px-4 py-3 md:px-10 rounded-md mt-8">
      <FormProvider {...methods}>
        <form
          className="flex flex-col md:flex-row justify-center md:items-center w-full gap-2"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <FormSelect
            classname="bg-white w-full"
            name="active"
            label="Status"
            placeholder="Selecione o filtro"
            options={statusOptions}
            defaultValue="all"
          />

          <FormSelect
            classname="bg-white"
            name="type"
            label="Tipo do produto"
            placeholder="Selecione o filtro"
            options={productTypeOptions}
            defaultValue="all"
          />

          <FormSelect
            classname="bg-white"
            name="stock"
            label="Estoque"
            placeholder="Selecione o filtro"
            options={stockOptions}
            defaultValue="all"
          />

          <ActionButton type="submit" icon={Filter} className="mt-5 text-secondary" />
        </form>
      </FormProvider>
    </div>
  );
}
