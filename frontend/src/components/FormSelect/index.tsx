import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface FormSelectProps<T extends string> {
  options: SelectOption<T>[];
  defaultValue?: T;
  placeholder?: string;
  name: string;
  classname?: string;
  label?: string;
}

export function FormSelect<T extends string>({
  name,
  options,
  placeholder,
  classname,
  defaultValue,
  label,
}: FormSelectProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex-1 relative">
      {label && (
        <label htmlFor={name} className="text-stone-600 font-semibold">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ""}
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className={cn("w-full text-gray-700", classname)}>
              <SelectValue placeholder={placeholder ?? "Selecione um valor"} />
            </SelectTrigger>
            <SelectContent className="max-h-80 overflow-y-scroll  border-secondary border-2">
              <SelectGroup>
                {options?.map((option) => {
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-gray-700"
                    >
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
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
