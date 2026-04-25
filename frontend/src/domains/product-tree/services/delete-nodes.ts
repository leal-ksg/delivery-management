import { toast } from "@/components/ui/sonner";
import api, { ApiResponse } from "@/lib/api";
import { handleRequest } from "@/lib/handleRequest";
import { DeleteNodeDTO } from "../types";

export const deleteNodes = async (
  nodes: DeleteNodeDTO[],
): Promise<ApiResponse<void>> => {
  const response = await handleRequest<void>({
    successMessage: "Produto(s) removido(s) da árvore!",
    defaultError: "Ocorreu um erro desconhecido ao remover da árvore...",
    request: api.delete(`/product-tree`, { data: nodes }),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
