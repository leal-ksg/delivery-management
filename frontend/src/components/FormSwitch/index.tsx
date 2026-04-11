import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface FormSwitchProps {
  name: string;
  label?: string;
  classname?: string;
  defaultValue?: boolean;
  disabled?: boolean;
}

export function FormSwitch({
  name,
  label,
  classname,
  defaultValue,
  disabled,
}: FormSwitchProps) {
  const { control } = useFormContext();

  return (
    <div className={cn("flex flex-col items-center justify-center", classname)}>
      {label && <span className="text-stone-600 font-semibold">{label}</span>}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Switch
            disabled={disabled}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
