import api, { ApiResponse } from "@/lib/api";
import { CreateOrderDTO, Order } from "../types";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";

export const createOrder = async (
  order: CreateOrderDTO,
): Promise<ApiResponse<Order>> => {
  const response = await handleRequest<Order>({
    successMessage: "Venda criada com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao criar a venda...",
    request: api.post(`/order`, order),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
