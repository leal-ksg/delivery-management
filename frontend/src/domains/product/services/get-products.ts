import api, { ApiResponse } from "@/lib/api";
import { Product } from "../types";
import axios from "axios";
import { Pagination } from "../../types";

export async function getProducts(
  query: string,
  page: number,
  itemsPerPage: number,
): Promise<ApiResponse<Pagination<Product>>> {
  try {
    const { data } = await api.get("/product", {
      params: {
        query,
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
