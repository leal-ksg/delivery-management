import api, { ApiResponse } from "@/lib/api";
import { Customer } from "../types";
import axios from "axios";

export async function getCustomers(
  page: number,
  itemsPerPage: number,
): Promise<
  ApiResponse<{
    list: Customer[];
    total: number;
    page: number;
    itemsPerPage: number;
  }>
> {
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
