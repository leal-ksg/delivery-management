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

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  name: string;
  classname?: string;
  label?: string;
}

export function FormSelect({
  name,
  options,
  placeholder,
  classname,
  defaultValue,
  label,
}: FormSelectProps) {
  const { control } = useFormContext();

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
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={(value) => field.onChange(value)}
            defaultValue={defaultValue ?? ""}
          >
            <SelectTrigger className={cn("w-full text-gray-700", classname)}>
              <SelectValue placeholder={placeholder ?? "Selecione um valor"} />
            </SelectTrigger>
            <SelectContent className="border-secondary border-2">
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
    </div>
  );
}
