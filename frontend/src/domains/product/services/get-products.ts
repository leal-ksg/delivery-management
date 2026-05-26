import api, { ApiResponse } from "@/lib/api";
import { Product, ProductFilters } from "../types";
import axios from "axios";
import { Pagination } from "../../types";

export async function getProducts(
  query: string,
  page: number,
  itemsPerPage: number,
  filters?: ProductFilters
): Promise<ApiResponse<Pagination<Product>>> {
  try {
    // console.log(filters)
    const { data, request } = await api.get("/product", {
      params: {
        query,
        page,
        itemsPerPage,
        ...filters
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
