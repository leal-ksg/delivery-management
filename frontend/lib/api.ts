import axios from "axios";

export type ApiResponse<T> =
  | { ok: true; body: T; message?: string }
  | { ok: false; error: string };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
