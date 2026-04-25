import api, { ApiResponse } from "@/lib/api";
import { ProductTree } from "../types";
import axios from "axios";
import { Pagination } from "../../types";

export async function getNodes(
  page: number,
  itemsPerPage: number,
): Promise<ApiResponse<Pagination<ProductTree>>> {
  try {
    const { data } = await api.get("/product-tree", {
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

    return { ok: false, error: "Ocorreu um erro na busca da árvore de produtos" };
  }
}
