import api, { ApiResponse } from "@/lib/api";
import { Product } from "../types";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";

export const updateProduct = async (
  id: string,
  product: Partial<Product>,
): Promise<ApiResponse<Product>> => {
  const response = await handleRequest<Product>({
    successMessage: "Produto atualizado com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao atualizar o produto...",
    request: api.patch(`/product/${id}`, product),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
