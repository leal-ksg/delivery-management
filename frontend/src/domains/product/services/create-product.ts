import api, { ApiResponse } from "@/lib/api";
import { CreateProductDTO, Product } from "../types";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";

export const createProduct = async (
  product: CreateProductDTO,
): Promise<ApiResponse<Product>> => {
  const response = await handleRequest<Product>({
    successMessage: "Produto cadastrado com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao criar o produto...",
    request: api.post(`/product`, product),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
