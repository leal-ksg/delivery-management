import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  name: string;
  label?: string;
}

export function FormInput({
  className,
  name,
  label,
  ...props
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex-1">
      {label && (
        <label htmlFor={name} className="text-stone-600 font-semibold">
          {label}
        </label>
      )}

      <Input
        {...props}
        {...register(name)}
        className={cn(className)}
        autoComplete="off"
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
