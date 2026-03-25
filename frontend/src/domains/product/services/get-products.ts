import api, { ApiResponse } from "@/lib/api";
import { Product } from "../types";
import axios from "axios";

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  try {
    const { data } = await api.get("/product");
    return { ok: true, body: data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { ok: false, error: JSON.stringify(error) };
    }

    return { ok: false, error: "Ocorreu um erro na busca dos produtos" };
  }
}
