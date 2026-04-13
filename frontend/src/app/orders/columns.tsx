"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  orderStatusTranslation,
  productTypeTranslation,
} from "@/lib/field-translations";
import { Order, OrderStatus } from "@/src/domains/order/types";
import { Product, ProductType } from "@/src/domains/product/types";
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
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => {
      const orderStatus: OrderStatus = cell.getValue() as OrderStatus;
      return orderStatusTranslation[orderStatus] ?? "Não informado";
    },
  },
  {
    accessorKey: "Lançada em",
    header: "createdAt",
  },
  {
    id: "customer",
    header: "Cliente",
    cell: ({ row }) => {
      return `${row.original.customer.name} ${row.original.customer.surname}`;
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
