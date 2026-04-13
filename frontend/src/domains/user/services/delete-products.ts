import { toast } from "@/components/ui/sonner";
import api, { ApiResponse } from "@/lib/api";
import { handleRequest } from "@/lib/handleRequest";

export const deleteProducts = async (
  ids: string[],
): Promise<ApiResponse<void>> => {
  const response = await handleRequest<void>({
    successMessage: "Produto(s) excluído(s) com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao excluir o produto...",
    request: api.delete(`/product`, { data: ids }),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
