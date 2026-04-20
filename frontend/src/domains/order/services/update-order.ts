import api, { ApiResponse } from "@/lib/api";
import { Order } from "../types";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";

export const updateOrder = async (
  id: number,
  order: Partial<Order>,
): Promise<ApiResponse<Order>> => {
  const response = await handleRequest<Order>({
    successMessage: "Venda atualizada com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao atualizar a venda...",
    request: api.patch(`/order/${id}`, order),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
