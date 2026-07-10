"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { ToolbarProvider } from "@/contexts/toolbar-context";
import { Sidebar } from "@/src/components/Sidebar";
import { Toolbar } from "@/src/components/Toolbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToolbarProvider>
        <div className="flex h-dvh overflow-hidden bg-primary">
          <Sidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <Toolbar />

            <main className="flex-1 overflow-y-auto bg-[#d4d4d4]">
              {children}
            </main>
          </div>
        </div>
      </ToolbarProvider>
    </AuthProvider>
  );
}
