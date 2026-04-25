import api, { ApiResponse } from "@/lib/api";
import { ProductTreeDTO } from "../types";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";

export const createNode = async (
  node: ProductTreeDTO,
): Promise<ApiResponse<ProductTreeDTO>> => {
  const response = await handleRequest<ProductTreeDTO>({
    successMessage: "Produto adicionado na árvore!",
    defaultError: "Ocorreu um erro desconhecido ao adicionar o produto...",
    request: api.post(`/product-tree`, node),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
