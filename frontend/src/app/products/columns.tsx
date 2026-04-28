"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { productTypeTranslation } from "@/lib/field-translations";
import { formatMoney } from "@/lib/format-money";
import { Product, ProductType } from "@/src/domains/product/types";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, TriangleAlert } from "lucide-react";

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
      return cell.getValue() ? (
        <Badge>Ativo</Badge>
      ) : (
        <Badge variant="destructive">Inativo</Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "stockQuantity",
    header: "Estoque",
    cell: ({ row }) => {
      const stock = row.original.stockQuantity;
      const minStock = row.original.minStock;

      return (
        <span className="flex items-center gap-3 font-semibold">
          {stock > minStock || minStock === 0 ? (
            <CircleCheck className="text-green-400" />
          ) : (
            <TriangleAlert className="text-orange-500" />
          )}
          {stock}
        </span>
      );
    },
  },
  {
    accessorKey: "totalCost",
    header: "Custo total",
    cell: ({ cell }) => {
      return formatMoney(Number(cell.getValue())) || " - ";
    },
  },
  {
    accessorKey: "unitPrice",
    header: "Preço unit.",
    cell: ({ cell }) => {
      return formatMoney(Number(cell.getValue()));
    },
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
