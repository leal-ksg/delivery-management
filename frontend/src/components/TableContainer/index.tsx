"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
  classname?: string;
}

export function TableContainer({ children, classname }: TableContainerProps) {
  return (
    <div
      className={cn(
        "w-[80%] min-h-170 overflow-y-hidden my-auto pt-20 pb-4 md:min-h-125 md:py-8",
        classname,
      )}
    >
      {children}
    </div>
  );
}
