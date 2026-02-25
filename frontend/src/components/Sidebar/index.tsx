"use server";

import { LucideIcon, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SidebarLinkProps {
  icon?: LucideIcon;
  text: string;
  href: string;
}

const SidebarLink = ({ icon: Icon, text, href }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-2 bg-secondary h-7 w-full max-h-45 rounded-lg px-4 duration-300 hover:bg-slate-600 transition-colors`}
    >
      {Icon && (
        <Icon size={20} className="text-light-foreground" strokeWidth={3} />
      )}
      <p className="font-semibold text-light-foreground">{text}</p>
    </Link>
  );
};

export const Sidebar = async () => {
  return (
    <aside className="flex flex-col items-center p-2 rounded-tr-2xl rounded-br-2xl bg-slate-900 h-full w-52">
      <Image src="/logo_kairos.png" alt="logo" width={118} height={124} />

      <p className="text-xs self-start font-semibold text-gray-600">CADASTROS</p>
      <div className="w-full max-h-45 mt-24">
        <SidebarLink icon={Home} href="/" text="Home" />
      </div>
    </aside>
  );
};
