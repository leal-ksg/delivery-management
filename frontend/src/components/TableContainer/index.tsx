"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
  contentClassname?: string;
  containerClassname?: string;
}

export function TableContainer({ children, contentClassname, containerClassname }: TableContainerProps) {
  return (
    <div className={cn("flex w-[80%] items-center bg-white justify-center p-4 rounded-md mt-3", containerClassname)}>
      <div
        className={cn(
          "flex flex-col justify-center w-full overflow-y-hidden pb-4 md:pb-0",
          contentClassname,
        )}
      >
        {children}
      </div>
    </div>
  );
}