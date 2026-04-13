import api, { ApiResponse } from "@/lib/api";
import { Order } from "../types";
import axios from "axios";

export async function getOrders(
  page: number,
  itemsPerPage: number,
): Promise<
  ApiResponse<{
    list: Order[];
    total: number;
    page: number;
    itemsPerPage: number;
  }>
> {
  try {
    const { data } = await api.get("/order", {
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

    return { ok: false, error: "Ocorreu um erro na busca das vendas" };
  }
}
