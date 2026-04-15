import { Input } from "@/components/ui/input";
import { observe } from "@/lib/observer";
import { cn } from "@/lib/utils";
import { ChangeEvent, useEffect, useRef } from "react";

interface SearchInputOption<T> {
  label: string;
  value: T;
}

interface SearchInputProps<
  T,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  onEndOfList: () => void;
  onSelectOption: (option: T) => void;
  options: SearchInputOption<T>[];
  className?: string;
}

export function SearchInput<T>({
  onChange,
  onEndOfList,
  value,
  onSelectOption,
  options,
  className,
  ...props
}: SearchInputProps<T>) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observe({
        target: observerRef.current,
        onEntry: onEndOfList,
        onLeave: () => {},
      });
    }
  }, [onEndOfList]);

  return (
    <>
      <Input
        className={cn("w-full", className)}
        value={value}
        onChange={onChange}
        {...props}
      />

      <div className="bg-slate-300 rouded-md w-full">
        {options.map(
          (options, index) => (
            <button
              type="button"
              key={index}
              className="bg-slate-700 w-full h-20"
              onClick={() => onSelectOption(options.value)}
            >
              {options.label}
            </button>
          ),
          [],
        )}

        <div ref={observerRef} id="observer" />
      </div>
    </>
  );
}
