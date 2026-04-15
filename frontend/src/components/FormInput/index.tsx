import { Input } from "@/components/ui/input";
import { PatternFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  name: string;
  label?: string;
  mask?: string;
  unique?: boolean;
}

export function FormInput({
  className,
  name,
  label,
  mask,
  unique,
  ...props
}: FormInputProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  if (mask)
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
          </label>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <PatternFormat
              format={mask}
              customInput={Input}
              value={field.value ?? ""}
              onValueChange={(values) => field.onChange(values.value)}
              className={cn("bg-neutral-100", className)}
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

  return (
    <div className="flex-1 relative">
      {label && (
        <label htmlFor={name} className="text-stone-600 font-semibold">
          {label}
        </label>
      )}

      <Input
        {...props}
        {...register(name)}
        className={cn("bg-neutral-100 text-neutral-800", className)}
        autoComplete="off"
      />

      {error && (
        <span className="absolute text-sm text-red-400 font-semibold">
          {error}
        </span>
      )}
    </div>
  );
}
