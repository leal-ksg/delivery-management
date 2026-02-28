import { Product } from "@/src/domains/product/types";
import { ColumnDef } from "@tanstack/react-table";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "status",
    header: "Status",
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
  },
];
