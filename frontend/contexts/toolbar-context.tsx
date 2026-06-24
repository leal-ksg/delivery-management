"use client";

import { createContext, useContext, useState } from "react";

interface ToolbarState {
  description: string;
  showGoBack: boolean;
}

interface ToolbarContextData {
  toolbar: ToolbarState;
  setToolbar: (toolbar: ToolbarState) => void;
}

const ToolbarContext = createContext<ToolbarContextData | null>(null);

export function ToolbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toolbar, setToolbar] = useState<ToolbarState>({
    description: "",
    showGoBack: false,
  });

  return (
    <ToolbarContext.Provider value={{ toolbar, setToolbar }}>
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbar() {
  const context = useContext(ToolbarContext);

  if (!context) {
    throw new Error("useToolbar must be used inside ToolbarProvider");
  }

  return context;
}