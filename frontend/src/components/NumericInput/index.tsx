import { Input } from "@/components/ui/input";
import { NumericFormat, OnValueChange } from "react-number-format";
import { cn } from "@/lib/utils";

interface NumericInputProps {
  className?: string;
  name: string;
  label?: string;
  unique?: boolean;
  optional?: boolean;
  value: string | number;
  onValueChange: OnValueChange;
  thousandSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  allowNegative?: boolean;
}

export function NumericInput({
  className,
  name,
  label,
  unique,
  optional,
  value,
  onValueChange,
  thousandSeparator,
  decimalSeparator,
  prefix,
  decimalScale,
  fixedDecimalScale,
  allowNegative,
}: NumericInputProps) {
  return (
    <div className="flex-1">
      {label && (
        <label htmlFor={name} className="text-stone-600 font-semibold">
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

      <NumericFormat
        name={name}
        customInput={Input}
        value={value}
        onValueChange={onValueChange}
        className={cn("bg-neutral-100", className)}
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        prefix={prefix}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        allowNegative={allowNegative}
      />
    </div>
  );
}
