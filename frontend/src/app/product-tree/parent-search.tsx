import { FormSearchSelect } from "@/src/components/FormSearchSelect";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Search } from "lucide-react";
import { loadProductTreeOptions } from "@/src/domains/product-tree/services/load-product-tree-options";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

interface ParentSearchProps {
  onSearch: (parentId: string) => void;
  isLoading: boolean;
}

interface FormData {
  parentId: { label: string; value: string };
}

export function ParentSearch({ onSearch, isLoading }: ParentSearchProps) {
  const searchForm = useForm<FormData>();

  const parentId = useWatch({ control: searchForm.control, name: "parentId" });

  function onSubmit() {
    console.log(parentId);
    if (!parentId) return;

    onSearch(parentId.value);
  }

  useEffect(() => {
    console.log(parentId)
    onSearch(parentId?.value);
  }, [onSearch, parentId, parentId?.value]);

  return (
    <FormProvider {...searchForm}>
      <form
        className="flex w-[80%] items-center justify-center gap-2 mt-15 2xl:mt-40"
        onSubmit={searchForm.handleSubmit(onSubmit)}
      >
        <FormSearchSelect
          name="parentId"
          placeholder="Selecione o produto pai..."
          defaultOptions
          loadOptions={loadProductTreeOptions}
          className="w-full 2xl:w-1/2"
        />

      </form>
    </FormProvider>
  );
}
