import debounce from "lodash.debounce";
import { Option } from "../../types";
import { getProducts } from "../../product/services/get-products";

const fetchProducts = async (inputValue: string): Promise<Option<string>[]> => {
  const response = await getProducts(inputValue, 0, 20);

  if (!response.ok) {
    return [];
  }

  return response.body.list.map((p) => ({
    label: p.name,
    value: p.id,
  }));
};

export const loadProductTreeOptions = (
  inputValue: string,
): Promise<Option<string>[]> => {
  const debouncedFetch = debounce(
    (inputValue: string, resolve: (value: Option<string>[]) => void) => {
      fetchProducts(inputValue).then(resolve);
    },
    1000,
  );

  return new Promise((resolve) => {
    debouncedFetch(inputValue, resolve);
  });
};
