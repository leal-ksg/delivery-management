import { XCircle } from "lucide-react";
import { ProductOptionValue } from "../form";
import { Dispatch, SetStateAction } from "react";

interface CheckoutProps {
  products: ProductOptionValue[];
  updateProducts: Dispatch<SetStateAction<ProductOptionValue[]>>;
}

export function Checkout({ products, updateProducts }: CheckoutProps) {
  return (
    <div className="flex flex-col gap-3 w-full lg:p-3 max-h-49 lg:max-h-120 overflow-y-auto">
      {products.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-100 border border-neutral-200 shadow-sm"
        >
          <div className="flex flex-col flex-1">
            <span className="text-sm font-semibold text-neutral-800">
              {p.name}
            </span>

            <span className="text-xs text-neutral-500">
              R$ {Number(p.unitPrice).toFixed(2)}
            </span>
          </div>

          <input
            type="number"
            min={1}
            defaultValue={1}
            className="w-16 h-9 text-center rounded-md border border-neutral-300 bg-white text-sm outline-none focus:ring-2 focus:ring-secondary"
            onChange={(e) => {
              const value = Number(e.target.value);

              updateProducts((prev) =>
                prev.map((item) =>
                  item.id === p.id ? { ...item, quantity: value } : item,
                ),
              );
            }}
          />

          <button
            type="button"
            onClick={() => {
              updateProducts((prev) => prev.filter((item) => item.id !== p.id));
            }}
            className="flex items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-300 hover:cursor-pointer transition"
          >
            <XCircle size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
