"use client";

import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
}

export function TableContainer({ children }: TableContainerProps) {
  return (
    <div className="w-[80%] min-h-170 overflow-y-hidden my-auto pt-20 pb-4 md:min-h-125 md:py-8">
      {children}
    </div>
  );
}
