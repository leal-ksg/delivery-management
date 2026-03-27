import axios from "axios";

export type ApiResponse<T> =
  | { ok: true; body: T; message?: string }
  | { ok: false; error: string };

const api = axios.create({
  baseURL: "http://192.168.1.60:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
