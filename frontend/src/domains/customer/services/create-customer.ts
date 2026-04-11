import api, { ApiResponse } from "@/lib/api";
import { handleRequest } from "@/lib/handleRequest";
import { toast } from "@/components/ui/sonner";
import { CreateCustomerDTO, Customer } from "../types";

export const createCustomer = async (
  customer: CreateCustomerDTO,
): Promise<ApiResponse<Customer>> => {
  const response = await handleRequest<Customer>({
    successMessage: "Cliente cadastrado com sucesso!",
    defaultError: "Ocorreu um erro desconhecido ao cadastrar o cliente...",
    request: api.post(`/customer`, customer),
  });

  if (response.ok) {
    toast("success", response.message!);
  } else {
    toast("error", response.error);
  }

  return response;
};
