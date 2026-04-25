import api, { ApiResponse } from "@/lib/api";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";
import { ProductTreeDTO } from "../types";

export const updateNode = async (
  node: ProductTreeDTO,
): Promise<ApiResponse<ProductTreeDTO>> => {
  const response = await handleRequest<ProductTreeDTO>({
    successMessage: "Produto atualizado na árvore!",
    defaultError: "Ocorreu um erro desconhecido ao atualizar o produto na árvore...",
    request: api.patch(`/product-tree`, node),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
