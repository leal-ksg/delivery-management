import { handleRequest } from "@/lib/handleRequest";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { UserDTO } from "../types";

export async function loginRequest(email: string, password: string) {
  const response = await handleRequest<UserDTO | null>({
    successMessage: "",
    defaultError: "Usuário ou senha inválidos",
    request: api.post(`/auth/login`, { email, password }),
  });

  if (!response.ok) {
    toast("error", response.error);
  }

  return response;
}
