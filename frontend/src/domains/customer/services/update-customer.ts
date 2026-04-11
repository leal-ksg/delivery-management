import api, { ApiResponse } from "@/lib/api";
import { Customer } from "../types";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";

export const updateCustomer = async (
  id: string,
  customer: Partial<Customer>,
): Promise<ApiResponse<Customer>> => {
  const response = await handleRequest<Customer>({
    successMessage: "Dados do cliente atualizados com sucesso!",
    defaultError:
      "Ocorreu um erro desconhecido ao atualizar os dados do cliente...",
    request: api.patch(`/customer/${id}`, customer),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
