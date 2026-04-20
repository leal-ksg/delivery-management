import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface FormNumericInputProps {
  className?: string;
  name: string;
  label?: string;
  unique?: boolean;
  optional?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  allowNegative?: boolean;
}

export function FormNumericInput({
  className,
  name,
  label,
  unique,
  optional,
  thousandSeparator,
  decimalSeparator,
  prefix,
  decimalScale,
  fixedDecimalScale,
  allowNegative,
}: FormNumericInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex-1 relative">
      {label && (
        <label className="text-stone-600 font-semibold">
          {label}
          {unique && (
            <>
              <span className="ml-2 text-purple-300">(único)</span>
            </>
          )}
          {optional && (
            <>
              <span className="ml-2 text-orange-300">(opcional)</span>
            </>
          )}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NumericFormat
            name={name}
            customInput={Input}
            autoComplete="off"
            value={field.value ?? ""}
            onValueChange={(values) => field.onChange(values.value)}
            className={cn("bg-neutral-100", className)}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            prefix={prefix}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            allowNegative={allowNegative}
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
