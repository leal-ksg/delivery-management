import { toast } from "@/components/ui/sonner";
import api, { ApiResponse } from "@/lib/api";
import { handleRequest } from "@/lib/handleRequest";

export const deleteOrders = async (
  ids: number[],
): Promise<ApiResponse<void>> => {
  const response = await handleRequest<void>({
    successMessage: "Venda(s) excluída(s) com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao excluir a venda...",
    request: api.delete(`/order`, { data: ids }),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
