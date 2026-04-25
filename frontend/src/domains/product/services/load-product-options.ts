import { ProductOptionValue } from "@/src/app/orders/form";
import { getProducts } from "./get-products";
import debounce from "lodash.debounce";
import { Option } from "../../types";

const fetchProducts = async (
  inputValue: string,
): Promise<Option<ProductOptionValue>[]> => {
  const response = await getProducts(inputValue, 0, 20);

  if (!response.ok) {
    return [];
  }

  return response.body.list.map((p) => ({
    label: p.name,
    value: { name: p.name, id: p.id, unitPrice: p.unitPrice },
  }));
};

const debouncedFetch = debounce(
  (
    inputValue: string,
    resolve: (value: Option<ProductOptionValue>[]) => void,
  ) => {
    fetchProducts(inputValue).then(resolve);
  },
  1000,
);

export const loadProductOptions = (
  inputValue: string,
): Promise<Option<ProductOptionValue>[]> => {
  return new Promise((resolve) => {
    debouncedFetch(inputValue, resolve);
  });
};
