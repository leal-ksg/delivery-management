import { Input } from "@/components/ui/input";
import { OnValueChange, PatternFormat } from "react-number-format";
import { cn } from "@/lib/utils";

interface InputMaskProps {
  className?: string;
  name: string;
  label?: string;
  mask: string;
  unique?: boolean;
  optional?: boolean;
  value: string | number;
  onValueChange: OnValueChange;
}

export function InputMask({
  className,
  name,
  label,
  mask,
  unique,
  optional,
  value,
  onValueChange,
}: InputMaskProps) {
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

      <PatternFormat
        name={name}
        format={mask}
        customInput={Input}
        value={value}
        onValueChange={onValueChange}
        className={cn("bg-neutral-100", className)}
      />
    </div>
  );
}
