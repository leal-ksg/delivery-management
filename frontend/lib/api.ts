import axios from "axios";

export type ApiResponse<T> = { ok: true, body: T; message: string } | { ok: false, error: string };

const api = axios.create({
  baseURL: "http://localhost:3333/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
