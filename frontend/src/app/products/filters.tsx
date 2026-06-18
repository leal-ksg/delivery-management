import { productTypeTranslation } from "@/lib/field-translations";
import ActionButton from "@/src/components/ActionButton";
import { FormSelect } from "@/src/components/FormSelect";
import { ProductType } from "@/src/domains/product/types";
import { Filter } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

export function ProductFilters() {
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

  const productTypeOptions = Object.values(ProductType).map((value) => ({
    label: productTypeTranslation[value],
    value,
  }));

  return (
    <div className="w-[80%]  bg-white py-5 px-10 rounded-lg  mt-15">
      <FormProvider {...methods}>
        <form className="flex justify-center items-center w-full gap-2">
          <FormSelect
            classname="bg-white"
            name="status"
            label="Status"
            placeholder="Selecione o filtro"
            options={statusOptions}
          />

          <FormSelect
            classname="bg-white"
            name="type"
            label="Tipo do produto"
            placeholder="Selecione o filtro"
            options={productTypeOptions}
          />

          <FormSelect
            classname="bg-white"
            name="type"
            label="Estoque"
            placeholder="Selecione o filtro"
            options={productTypeOptions}
          />

          <ActionButton type="submit" icon={Filter} className="mt-5"></ActionButton>
        </form>
      </FormProvider>
    </div>
  );
}
