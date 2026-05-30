"use client";

import { LucideIcon, HandCoins, Menu, X, Boxes, Network } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarLinkProps {
  icon?: LucideIcon;
  text: string;
  href: string;
  isOpen: boolean;
  isMobile: boolean;
  onNavigate?: () => void;
}

interface LinkWrapperProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
}

function SidebarLink({
  icon: Icon,
  text,
  href,
  isOpen,
  isMobile,
  onNavigate,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`
        relative flex items-center h-10 w-full rounded-lg
        transition-colors duration-200
        ${isActive ? "bg-secondary/80" : "hover:bg-slate-700/50"}
      `}
    >
      <div
        className={`items-center w-full h-full ${
          isOpen ? "flex px-4" : "hidden md:flex md:justify-center"
        }`}
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
        className={`h-8 mt-6 mb-2 items-center px-4 relative ${
          isOpen ? "flex" : "hidden md:flex"
        }`}
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
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = false;

  const handleNavigate = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {!isOpen && (
        <button
          aria-label="Abrir menu"
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-2.5 left-4 z-50 p-2 bg-gray-200/10 rounded-lg text-slate-200"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      )}

      <aside
        className={`
          h-dvh
          transition-[width]
          duration-300
          ease-in-out
          z-50
          min-h-full
          pt-[env(safe-area-inset-top)]
          pb-[env(safe-area-inset-bottom)]
          fixed md:relative top-0 left-0
          ${isOpen ? "w-52" : "w-0 md:w-20"}
        `}
      >
        <div className="flex flex-col bg-primary min-h-full overflow-hidden">
          <div className="relative h-36 w-full shrink-0">
            <div
              className={`absolute top-2 transition-all duration-300 ${
                isOpen ? "right-2" : "left-1/2 -translate-x-1/2"
              }`}
            >
              <button
                aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setIsOpen((v) => !v)}
                className={`p-2 rounded-lg hover:bg-slate-800 text-slate-200 focus:outline-none ${
                  !isOpen && "hidden md:block"
                }`}
              >
                {isOpen ? <X size={20} /> : <Menu size={22} strokeWidth={2} />}
              </button>
            </div>
          </div>

          <div className="flex-1 w-full px-3 pb-4 overflow-y-auto overflow-x-hidden no-scrollbar">
            <LinkWrapper title="Movimentações" isOpen={isOpen}>
              <SidebarLink
                icon={HandCoins}
                href="/orders"
                text="Vendas"
                isOpen={isOpen}
                isMobile={isMobile}
                onNavigate={handleNavigate}
              />
            </LinkWrapper>

            <LinkWrapper title="Cadastros" isOpen={isOpen}>
              <SidebarLink
                icon={Boxes}
                href="/products"
                text="Produtos"
                isOpen={isOpen}
                isMobile={isMobile}
                onNavigate={handleNavigate}
              />

              <SidebarLink
                icon={Network}
                href="/product-tree"
                text="Árvore de produtos"
                isOpen={isOpen}
                isMobile={isMobile}
                onNavigate={handleNavigate}
              />
            </LinkWrapper>
          </div>
        </div>
      </aside>
    </>
  );
}