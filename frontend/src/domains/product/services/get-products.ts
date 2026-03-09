import api, { ApiResponse } from "@/lib/api";
import { Product } from "../types";

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  try {
    const { data } = await api.get("/product");
    return { ok: true, body: data };
  } catch {
    return { ok: false, error: "Ocorreu um erro na busca dos produtos" };
  }
}
