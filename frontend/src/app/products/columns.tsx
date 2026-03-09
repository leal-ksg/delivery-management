"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { productTypeTranslation } from "@/lib/field-translations";
import { Product, ProductType } from "@/src/domains/product/types";
import { ColumnDef } from "@tanstack/react-table";

export const productColumns: ColumnDef<Product>[] = [
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
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "unitPrice",
    header: "Preço unit.",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ cell }) => {
      const productTypes: ProductType = cell.getValue() as ProductType;
      return productTypeTranslation[productTypes] ?? "Não informado";
    },
  },
];
