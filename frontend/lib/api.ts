import axios from "axios";

export type ApiResponse<T> =
  | { ok: true; body: T; message?: string }
  | { ok: false; error: string };

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction ? "/api/v1" : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;