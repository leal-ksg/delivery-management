"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  LucideIcon,
  Home,
  ShoppingCart,
  HandCoins,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarLinkProps {
  icon?: LucideIcon;
  text: string;
  href: string;
  isOpen: boolean;
}

interface LinkWrapperProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
}

function SidebarLink({ icon: Icon, text, href, isOpen }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        relative flex items-center h-10 w-full rounded-lg
        transition-colors duration-200
        ${isActive ? "bg-secondary/80" : "hover:bg-slate-700/50"}
      `}
    >
      <div
        className={`items-center w-full h-full ${isOpen ? "flex px-4" : "hidden md:flex md:justify-center"}`}
      >
        {Icon && (
          <Icon
            size={20}
            className={`shrink-0 ${isActive ? "text-white" : "text-cyan-400"}`}
          />
        )}
        <span
          className={`
            whitespace-nowrap text-sm text-slate-200
            absolute left-12
            ${isOpen ? "block" : "hidden"}
          `}
        >
          {text}
        </span>
      </div>
    </Link>
  );
}

function LinkWrapper({ title, children, isOpen }: LinkWrapperProps) {
  return (
    <div className="w-full">
      <div
        className={`h-8 mt-6 mb-2 items-center px-4 relative ${isOpen ? "flex" : "hidden md:flex"}`}
      >
        {isOpen ? (
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase whitespace-nowrap">
            {title}
          </span>
        ) : (
          <div className="absolute left-1/2 -translate-x-1/2 h-px w-4 bg-slate-700" />
        )}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!!isMobile);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden absolute top-2.5 left-4 z-50 p-2 bg-gray-200/10 rounded-lg text-slate-200 "
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      )}

      <aside
        className={`h-dvh transition-[width] duration-300 ease-in-out z-50 min-h-full fixed md:relative top-0 left-0
          ${isOpen ? "w-52" : "w-0 md:w-20"}`}
      >
        <div className="flex flex-col bg-slate-900 rounded-tr-2xl rounded-br-2xl min-h-full overflow-hidden">
          <div className="relative h-36 w-full shrink-0">
            <div
              className={`absolute top-4 transition-all duration-300 ${isOpen ? "right-2" : "left-1/2 -translate-x-1/2"}`}
            >
              <button
                onClick={() => setIsOpen((v) => !v)}
                className={`p-2 rounded-lg hover:bg-slate-800 text-slate-200 focus:outline-none 
                  ${!isOpen && "hidden md:block"}`}
              >
                {isOpen ? <X size={20} /> : <Menu size={22} strokeWidth={2} />}
              </button>
            </div>

            {isOpen && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Image
                  src="/logo_kairos.png"
                  alt="logo"
                  width={110}
                  height={40}
                  priority
                  className="object-contain translate-y-2"
                />
              </div>
            )}
          </div>

          <div className="flex-1 w-full px-3 pb-4 overflow-y-auto overflow-x-hidden no-scrollbar">
            <LinkWrapper title="Início" isOpen={isOpen}>
              <SidebarLink
                icon={Home}
                href="/"
                text="Dashboard"
                isOpen={isOpen}
              />
            </LinkWrapper>

            <LinkWrapper title="Movimentações" isOpen={isOpen}>
              <SidebarLink
                icon={HandCoins}
                href="/sales"
                text="Vendas"
                isOpen={isOpen}
              />
              <SidebarLink
                icon={ShoppingCart}
                href="/purchases"
                text="Compras"
                isOpen={isOpen}
              />
            </LinkWrapper>

            <LinkWrapper title="Cadastros" isOpen={isOpen}>
              <SidebarLink
                icon={HandCoins}
                href="/customers"
                text="Clientes"
                isOpen={isOpen}
              />
              <SidebarLink
                icon={ShoppingCart}
                href="/products"
                text="Produtos"
                isOpen={isOpen}
              />
            </LinkWrapper>
          </div>
        </div>
      </aside>
    </>
  );
}
