import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "./api";

export async function handleRequest<T>({
  defaultError,
  successMessage,
  request,
}: {
  defaultError: string;
  successMessage: string;
  request: Promise<AxiosResponse>;
}): Promise<ApiResponse<T>> {
  try {
    const response = await request;

    return { ok: true, body: response.data.body, message: successMessage };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        ok: false,
        error: error.response?.data?.error ?? defaultError,
      };
    }

    return {
      ok: false,
      error: defaultError,
    };
  }
}
