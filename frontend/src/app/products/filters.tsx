import { productTypeTranslation } from "@/lib/field-translations";
import ActionButton from "@/src/components/ActionButton";
import { FormSelect } from "@/src/components/FormSelect";
import {
  ProductFilter,
  ProductFilterForm,
  ProductType,
} from "@/src/domains/product/types";
import { Filter, Eraser } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

interface ProductFiltersProps {
  onFiltersChange: Dispatch<SetStateAction<ProductFilter | null>>;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const methods = useForm<ProductFilterForm>({
    defaultValues: {
      active: "all",
      type: "all",
      stock: "all",
    },
  });

  const [active, type, stock] = useWatch({
    control: methods.control,
    name: ["active", "type", "stock"],
  });

  const hasFilters = active !== "all" || type !== "all" || stock !== "all";

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

  function cleanFilters(data: ProductFilterForm) {
    return {
      active:
        data.active === "all" || !data.active
          ? undefined
          : data.active === "true",
      type: data.type === "all" || !data.active ? undefined : data.type,
      stock: data.stock === "all" || !data.active ? undefined : data.stock,
    };
  }

  function onSubmit(data: ProductFilterForm) {
    onFiltersChange(cleanFilters(data));
    localStorage.setItem("product-filters", JSON.stringify(data));
  }

  function handleReset() {
    methods.setValue("active", "all");
    methods.setValue("type", "all");
    methods.setValue("stock", "all");

    const data = {
      active: undefined,
      type: undefined,
      stock: undefined,
    };

    onFiltersChange(data);
    localStorage.removeItem("product-filters");
  }

  useEffect(() => {
    const defaultFilters = localStorage.getItem("product-filters");

    if (defaultFilters) {
      const data: ProductFilterForm = JSON.parse(defaultFilters);

      console.log(data);

      methods.reset({
        active: data.active ?? "all",
        type: data.type ?? "all",
        stock: data.stock ?? "all",
      });

      onFiltersChange(cleanFilters(data));
    } else {
      onFiltersChange({});
    }
  }, [methods, onFiltersChange]);

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
            name="stock"
            label="Estoque"
            placeholder="Selecione o filtro"
            options={stockOptions}
          />

          <ActionButton
            type="submit"
            icon={Filter}
            className="mt-5 text-secondary"
          />

          {hasFilters && (
            <ActionButton
              icon={Eraser}
              className="mt-5 text-red-300"
              onClick={handleReset}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
}
