import axios from "axios";

export type ApiResponse<T> =
  | { ok: true; body: T; message?: string }
  | { ok: false; error: string };

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

console.log("Axios baseURL:", api.defaults.baseURL);

export default api;
