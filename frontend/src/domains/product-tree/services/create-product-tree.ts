import api, { ApiResponse } from "@/lib/api";
import { ProductTreeDTO } from "../types";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";

export const createNodes = async (
  nodes: ProductTreeDTO[],
): Promise<ApiResponse<ProductTreeDTO>> => {
  const response = await handleRequest<ProductTreeDTO>({
    successMessage: `${nodes.length > 1 ? "Produtos adicionados" : "Produto adicionado"} na árvore!`,
    defaultError: `Ocorreu um erro desconhecido ao adicionar ${nodes.length > 1 ? "os produtos" : "o produto"}...`,
    request: api.post(`/product-tree`, nodes),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
