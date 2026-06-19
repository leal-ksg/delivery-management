"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
  classname?: string;
}

export function TableContainer({ children, classname }: TableContainerProps) {
  return (
    <div className="flex w-[80%] items-center bg-white justify-center p-4 rounded-md mt-3">
      <div
        className={cn(
          "flex flex-col justify-center w-full min-h-[80dvh] overflow-y-hidden pb-4 md:min-h-125 md:pb-0",
          classname,
        )}
      >
        {children}
      </div>
    </div>
  );
}
