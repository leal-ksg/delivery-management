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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete?: () => void;
  onEdit?: () => void;
  onCreate?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onCreate,
  onDelete,
  onEdit,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      globalFilter,
      rowSelection,
    },
  });

  const isAnyRowSelected =
    table.getIsSomeRowsSelected() || table.getIsAllPageRowsSelected();

  async function handleDelete() {
    if (!onDelete) return;

    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    console.log(selectedRows);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col-reverse md:flex-row gap-2 justify-between">
        <Input
          type="text"
          placeholder="Busque por qualquer informação..."
          className="w-full md:w-[80%] placeholder:text-gray-400"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(String(e.target.value))}
        />

        <div className="flex items-center gap-2 self-end">
          <ActionButton
            disabled={!onCreate}
            className="text-green-500"
            onClick={onCreate ? onCreate : () => {}}
            icon={PlusIcon}
          />

          <ActionButton
            disabled={!onEdit || !isAnyRowSelected}
            className="text-violet-500"
            onClick={onEdit ? onEdit : () => {}}
            icon={EditIcon}
          />

          <ActionButton
            disabled={!onDelete || !isAnyRowSelected}
            className="text-red-500"
            onClick={handleDelete}
            icon={Trash2Icon}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md shadow-md">
        <Table className="table-auto">
          <TableHeader className="bg-secondary/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  className={`text-gray-600`}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"} uppercase`}
                      key={cell.id}
                    >
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
                  className="h-24 text-center font-semibold text-lg text-gray-700"
                >
                  Nenhum registro encontrado...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
