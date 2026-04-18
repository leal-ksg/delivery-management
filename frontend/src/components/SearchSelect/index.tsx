import { Option } from "@/src/domains/types";
import reactSelectTheme from "./styles";
import AsyncSelect from "react-select/async";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SearchSelectProps {
  name: string;
  loadOptions: (inputValue: string) => Promise<Option[]>;
  defaultOptions: boolean | Option[];
  label?: string;
  className?: string;
  placeholder?: string;
}

export function SearchSelect({
  name,
  loadOptions,
  defaultOptions,
  label,
  placeholder,
  className,
}: SearchSelectProps) {
  const { control } = useFormContext();

  return (
    <div className={cn("", className)}>
      {label && <span className="text-stone-600 font-semibold">{label}</span>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AsyncSelect
            isClearable
            onChange={field.onChange}
            value={field.value}
            defaultOptions={defaultOptions}
            styles={reactSelectTheme}
            loadOptions={loadOptions}
            placeholder={placeholder ? placeholder : "Selecione..."}
          />
        )}
      />
    </div>
  );
}
