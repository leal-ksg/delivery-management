import { ProductOptionValue } from "@/src/app/orders/form";
import { getProducts } from "./get-products";
import debounce from "lodash.debounce";
import { Option } from "../../types";
import { ProductFilters, ProductType } from "../types";

const fetchProducts = async (
  inputValue: string,
  filters?: ProductFilters,
): Promise<Option<ProductOptionValue>[]> => {
  const response = await getProducts(inputValue, 0, 20, filters);

  if (!response.ok) {
    return [];
  }

  return response.body.list.map((p) => ({
    label: p.name,
    value: {
      name: p.name,
      id: p.id,
      unitPrice: p.unitPrice,
      profitMargin: p.profitMargin,
    },
  }));
};

const debouncedFetch = debounce(
  (
    inputValue: string,
    onlySellable: boolean,
    resolve: (value: Option<ProductOptionValue>[]) => void,
  ) => {
    fetchProducts(
      inputValue,
      onlySellable ? { type: ProductType.SALE } : {},
    ).then(resolve);
  },
  1000,
);

export const loadProductOptions = (
  inputValue: string,
  onlySellable: boolean = false,
): Promise<Option<ProductOptionValue>[]> => {
  return new Promise((resolve) => {
    debouncedFetch(inputValue, onlySellable, resolve);
  });
};
