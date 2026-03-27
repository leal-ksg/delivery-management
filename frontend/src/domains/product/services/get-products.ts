import api, { ApiResponse } from "@/lib/api";
import { Product } from "../types";
import axios from "axios";

export async function getProducts(
  page: number,
  itemsPerPage: number,
): Promise<
  ApiResponse<{
    list: Product[];
    total: number;
    page: number;
    itemsPerPage: number;
  }>
> {
  try {
    const { data } = await api.get("/product", {
      params: {
        page,
        itemsPerPage,
      },
    });

    return { ok: true, body: data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { ok: false, error: JSON.stringify(error) };
    }

    return { ok: false, error: "Ocorreu um erro na busca dos produtos" };
  }
}
