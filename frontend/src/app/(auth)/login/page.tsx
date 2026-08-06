"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

const schema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail")
    .email("Informe um e-mail válido"),

  password: z.string().min(1, "Informe a senha"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    await login(data.email, data.password);
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Coluna esquerda */}
      <div className="hidden w-1/3 flex-col justify-center items-center bg-linear-to-br from-[#3c4966] to-primary p-16 text-white lg:flex">
        <Image src="/logo_kairos.png" alt="Kairos" width={320} height={320} />

        <div className="mt-16 h-px w-48 bg-white/30" />
      </div>

      {/* Coluna direita */}
      <div
        className="flex flex-1 items-center justify-center p-6 bg-linear-to-br
    from-[#3c4966]
    to-primary md:bg-white"
      >
        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Entrar</h2>

            <p className="mt-2 text-slate-500">
              Informe suas credenciais para acessar o sistema.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            autoComplete="on"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </label>

              <div className="relative">
                <AtSign
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />

                <input
                  placeholder="seu@email.com"
                  {...register("email")}
                  className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-4 outline-none transition focus:border-secondary"
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Senha
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-12 outline-none transition focus:border-secondary"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-secondary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-primary text-base font-semibold hover:bg-primary/80 cursor-pointer"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
