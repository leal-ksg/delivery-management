import { XCircle } from "lucide-react";
import {
  FieldArrayWithId,
  UseFieldArrayUpdate,
  useFormContext,
} from "react-hook-form";
import { FormData } from "../creation-form";

interface CheckoutProps {
  products: FieldArrayWithId<FormData, "products", "id">[];
  remove: (index: number) => void;
}

export function Checkout({ products, remove }: CheckoutProps) {
  const { register } = useFormContext<FormData>();

  return (
    <div className="flex flex-col gap-3 w-full">
      {products.map((p, index) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-100 border border-neutral-200 shadow-sm"
        >
          <div className="flex flex-col flex-1">
            <span className="text-sm font-semibold text-neutral-800">
              {p.child.name}
            </span>
          </div>

          <input
            type="number"
            className="w-16 h-9 text-center rounded-md border border-neutral-300 bg-white text-sm outline-none focus:ring-2 focus:ring-secondary"
            {...register(`products.${index}.childQuantity`, {
              valueAsNumber: true,
              max: 1000,
            })}
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="flex items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-300 transition"
          >
            <XCircle size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
