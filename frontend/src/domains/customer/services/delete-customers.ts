import { toast } from "@/components/ui/sonner";
import api, { ApiResponse } from "@/lib/api";
import { handleRequest } from "@/lib/handleRequest";

export const deleteCustomers = async (
  ids: string[],
): Promise<ApiResponse<void>> => {
  const response = await handleRequest<void>({
    successMessage: "Cliente(s) excluído(s) com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao excluir o cliente...",
    request: api.delete(`/customer`, { data: ids }),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
