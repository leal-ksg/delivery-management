import api, { ApiResponse } from "@/lib/api";

export const deleteProduct = async (
  productId: number,
): Promise<ApiResponse<void>> => {
  try {
    const { data } = await api.delete(`/products/${productId}`);

    return { ok: data.ok, body: data.body, message: data.message };
  } catch {
    return { ok: false, error: "Não foi possível excluir o produto..." };
  }
};
