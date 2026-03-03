"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ActionButton from "../ActionButton";
import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { on } from "events";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onCreate?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          type="text"
          placeholder="Busque por qualquer coluna..."
          className="w-1/2 placeholder:text-gray-400"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(String(e.target.value))}
        />

        <div className="flex items-center gap-2">
          <ActionButton
            disabled={true}
            className="text-green-500"
            onClick={() => {}}
            icon={PlusIcon}
          />

          <ActionButton
            className="text-violet-500"
            onClick={() => {}}
            icon={EditIcon}
          />

          <ActionButton
            className="text-red-500"
            onClick={() => {}}
            icon={Trash2Icon}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md shadow-md">
        <Table>
          <TableHeader className="bg-secondary/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-secondary/10" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-bold text-primary/60"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="text-gray-600"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
