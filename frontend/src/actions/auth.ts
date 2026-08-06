"use server";

import { cookies } from "next/headers";
import { UserDTO } from "@/src/domains/user/types";

export async function loginAction(email: string, password: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || "Erro ao fazer login" };
    }

    (await cookies()).set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    return { ok: true, user: data.user as UserDTO };
  } catch (error) {
    return { ok: false, error: "Erro de conexão" };
  }
}
