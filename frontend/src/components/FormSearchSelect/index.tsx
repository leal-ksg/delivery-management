import { Option } from "@/src/domains/types";
import reactSelectTheme from "./styles";
import AsyncSelect from "react-select/async";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SearchSelectProps<T> {
  name: string;
  loadOptions: (inputValue: string) => Promise<Option<T>[]>;
  defaultOptions: boolean | Option<T>[];
  label?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormSearchSelect<T>({
  name,
  loadOptions,
  defaultOptions,
  label,
  placeholder,
  className,
  disabled,
}: SearchSelectProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn("", className)}>
      {label && <span className="text-stone-600 font-semibold">{label}</span>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AsyncSelect
            isDisabled={disabled}
            cacheOptions
            isClearable
            onChange={field.onChange}
            value={field.value}
            defaultOptions={defaultOptions}
            styles={reactSelectTheme}
            loadOptions={loadOptions}
            placeholder={placeholder ? placeholder : "Selecione..."}
            loadingMessage={() => "Carregando..."}
            noOptionsMessage={() => "Nenhum resultado"}
          />
        )}
      />

      {error && (
        <span className="absolute text-sm text-red-400 font-semibold">
          {error}
        </span>
      )}
    </div>
  );
}
