"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Order } from "@/src/domains/order/types";
import { ColumnDef } from "@tanstack/react-table";

export const orderColumns: ColumnDef<Order>[] = [
  {
    id: "checkbox",
    header: ({ table }) => {
      const checked =
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate");

      return (
        <Checkbox
          className={`${checked ? "border-secondary text-light-foreground bg-secondary" : "border-slate-600"}`}
          checked={checked}
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "comment",
    header: () => <div className="text-center">Comentário</div>,
    cell: ({ cell }) => {
      const comment = String(cell.getValue());

      return (
        <div className="text-center">{comment === "" ? "-" : comment}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Lançada em",
    cell: ({ cell }) => {
      const date = new Date(String(cell.getValue()));

      const formated = date.toLocaleString("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
      });
      return formated;
    },
  },
  {
    id: "totalAmount",
    header: "Total de produtos",
    cell: ({ row }) => {
      return row.original.orderProducts.length;
    },
  },
];
