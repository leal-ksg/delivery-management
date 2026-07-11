"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/src/domains/customer/types";
import { ColumnDef } from "@tanstack/react-table";

export const customerColumns: ColumnDef<Customer>[] = [
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
    accessorKey: "active",
    header: "Status",
    cell: ({ cell }) => {
      return cell.getValue() ? "Ativo" : "Inativo";
    },
  },
  {
    id: "fullname",
    header: "Nome completo",
    cell: ({ row }) => {
      return `${row.original.name} ${row.original.surname}`;
    },
  },
  {
    accessorKey: "city",
    header: "Cidade",
  },
  {
    accessorKey: "state",
    header: "Estado",
  },
];
