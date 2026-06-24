import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "../components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toolbar } from "../components/Toolbar";
import { ToolbarProvider } from "@/contexts/toolbar-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Kairos - Handmade",
  description: "Sistema de gestão de estoque",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} antialiased font-sans`}
      >
        <TooltipProvider>
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
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
