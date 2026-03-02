import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
}

export default function TableContainer({ children }: TableContainerProps) {
  return <div className="w-[80%] my-auto pt-20 pb-4 md:py-8">{children}</div>;
}
