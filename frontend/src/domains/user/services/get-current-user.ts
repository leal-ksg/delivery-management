import api, { ApiResponse } from "@/lib/api";
import axios from "axios";
import { UserDTO } from "../types";

export async function getCurrentUser(): Promise<ApiResponse<UserDTO>> {
  try {
    const { data } = await api.get("/auth/me");

    return { ok: true, body: data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { ok: false, error: JSON.stringify(error) };
    }

    return { ok: false, error: "Ocorreu um erro na busca dos produtos" };
  }
}
