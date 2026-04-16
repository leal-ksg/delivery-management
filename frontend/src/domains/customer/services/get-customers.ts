import api, { ApiResponse } from "@/lib/api";
import { Customer } from "../types";
import axios from "axios";
import { Pagination } from "../../types";

export async function getCustomers(
  page: number,
  itemsPerPage: number,
): Promise<ApiResponse<Pagination<Customer>>> {
  try {
    const { data } = await api.get("/customer", {
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

    return { ok: false, error: "Ocorreu um erro na busca dos clientes" };
  }
}
