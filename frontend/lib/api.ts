import axios from "axios";

export type ApiResponse<T> =
  | { ok: true; body: T; message?: string }
  | { ok: false; error: string };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let resolveRehydration: (value: unknown) => void;
const rehydrationPromise = new Promise((resolve) => {
  resolveRehydration = resolve;
});

let isRehydrated = false;

export const markAsRehydrated = (token?: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  isRehydrated = true;
  resolveRehydration(true);
};

api.interceptors.request.use(
  async (config) => {
    if (!isRehydrated) {
      await rehydrationPromise;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
