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
import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  EditIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import ActionButton from "../ActionButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Spinner } from "@/components/ui/spinner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page?: number;
  total?: number;
  itemsPerPage?: number;
  onDelete?: (rows: TData[]) => Promise<void>;
  onEdit?: (rows: TData[]) => void;
  onCreate?: () => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  loading: boolean;
}

 /* @react-compiler ignore */
export function DataTable<TData, TValue>({
  columns,
  data,
  page = 0,
  total = 0,
  itemsPerPage = 0,
  onCreate,
  onDelete,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  loading,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const totalPages = Math.ceil(total / itemsPerPage);

  const enablePagination = useMemo(
    () => total && itemsPerPage && page,
    [itemsPerPage, total, page],
  );

  const table = useReactTable({
    data: data ?? [],
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
    table?.getIsSomeRowsSelected() || table?.getIsAllPageRowsSelected();

  async function handleDelete() {
    if (!onDelete) return;

    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    await onDelete(selectedRows);
  }

  function handleEdit() {
    if (!onEdit) return;

    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    onEdit(selectedRows);
    setRowSelection({});
  }

  function handleFilterChange(value: string) {
    setGlobalFilter(value);
    setRowSelection({});
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col-reverse md:flex-row gap-2 justify-between">
        <Input
          type="text"
          placeholder="Busque por qualquer informação..."
          className="w-full md:w-[80%] placeholder:text-gray-400"
          value={globalFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        />

        <div className="flex items-center gap-2 self-end">
          <ActionButton
            disabled={!onCreate}
            className="text-green-500 w-9"
            onClick={onCreate || (() => {})}
            icon={PlusIcon}
          />

          <ActionButton
            disabled={
              !onEdit ||
              !isAnyRowSelected ||
              table.getSelectedRowModel().rows.length > 1
            }
            className="text-violet-500 w-9"
            onClick={handleEdit}
            icon={EditIcon}
          />

          <ActionButton
            disabled={!onDelete || !isAnyRowSelected}
            className="text-red-500 w-9"
            onClick={handleDelete}
            icon={Trash2Icon}
          />
        </div>
      </div>

      <div className="rounded-md">
        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto rounded-md">
          <Table className="table-auto">
            <TableHeader className="bg-secondary/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    className="text-gray-600"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`
                          ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                          uppercase
                        `}
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
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        Carregando <Spinner />
                      </span>
                    ) : (
                      "Nenhum registro encontrado..."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  shadow-sm
                  p-4
                  space-y-3
                "
              >
                {row
                  .getVisibleCells()
                  .filter(
                    (
                      cell,
                    ): cell is typeof cell & {
                      column: typeof cell.column & {
                        columnDef: typeof cell.column.columnDef & {
                          header: string;
                        };
                      };
                    } => typeof cell.column.columnDef.header === "string",
                  )
                  .map((cell) => (
                    <div
                      key={cell.id}
                      className="
                        flex
                        justify-between
                        gap-4
                        border-b-2
                        border-gray-300
                        last:border-none
                        pb-2
                      "
                    >
                      <span className="text-xs font-semibold text-primary/60 uppercase">
                        {cell.column.columnDef.header}
                      </span>

                      <span className="text-sm text-right text-gray-700 font-medium">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <div className="h-24 flex items-center justify-center font-semibold text-gray-700">
              {loading ? (
                <span className="flex items-center gap-2">
                  Carregando <Spinner />
                </span>
              ) : (
                "Nenhum registro encontrado..."
              )}
            </div>
          )}
        </div>

        {enablePagination && onPageChange && onItemsPerPageChange ? (
          <div className="flex flex-col md:flex-row mt-2 rounded-lg items-center shadow-md justify-center gap-4 sm:gap-10 lg:gap-30 xl:gap-80 p-2 md:p-8 border-t border-[#DDDDDD] bg-white w-full  md:h-10 text-gray-400 font-semibold">
            <span className="">{total ? total : 0} registros</span>

            <div className="flex gap-6">
              <button
                type="button"
                className=" hover:cursor-pointer disabled:text-gray-200 disabled:cursor-default"
                onClick={() => onPageChange(page - 1)}
                disabled={page - 1 < 1}
              >
                <ChevronLeft />
              </button>

              <span>
                Página <span className="font-bold text-gray-500">{page}</span>{" "}
                de {totalPages}
              </span>

              <button
                type="button"
                className=" hover:cursor-pointer disabled:text-gray-200 disabled:cursor-default"
                onClick={() => onPageChange(page + 1)}
                disabled={page + 1 > totalPages}
              >
                <ChevronRight />
              </button>
            </div>

            <Select
              defaultValue="20"
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-18 hidden md:flex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
    </div>
  );
}
