"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatMoney } from "@/lib/format-money";
import { ProductTree } from "@/src/domains/product-tree/types";
import { ColumnDef } from "@tanstack/react-table";

export const productColumns: ColumnDef<ProductTree>[] = [
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
    id: "parentName",
    header: "Pai",
    accessorFn: (row) => {
      return row.parent.name;
    },
  },
  {
    id: "childName",
    header: "Filho",
    accessorFn: (row) => {
      return row.child.name;
    },
  },
  {
    accessorKey: "childQuantity",
    header: "Quantidade",
  },
  {
    accessorKey: "childUnitCost",
    header: "Custo unitário",
    cell: ({ cell }) => {
      return formatMoney(Number(cell.getValue()));
    },
  },
];
