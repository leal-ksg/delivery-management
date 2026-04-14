"use client";

import { DataTable } from "@/src/components/DataTable";
import { orderColumns } from "./columns";
import { TableContainer } from "@/src/components/TableContainer";
import { Toolbar } from "@/src/components/Toolbar";
import { useCallback, useEffect, useState } from "react";
import { EntityDialog } from "@/src/components/EntityDialog";
import { toast } from "@/components/ui/sonner";
import { Order } from "@/src/domains/order/types";
import { deleteOrders } from "@/src/domains/order/services/delete-orders";
import { getOrders } from "@/src/domains/order/services/get-orders";
import { OrderForm } from "./form";

function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [itemsperPage, setItemsPerPage] = useState<number>(20);

  function handleCancel() {
    setIsFormDialogOpen(false);
    setEditingOrder(null);
  }

  function handleSuccess() {
    setIsFormDialogOpen(false);
    setEditingOrder(null);
    setReload((prev) => !prev);
  }

  const handleEdit = useCallback((rows: Order[]) => {
    if (!rows || rows.length !== 1) return;

    setEditingOrder(rows[0]);
    setIsFormDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (rows: Order[]) => {
    const ids = rows.map((order) => order.id);
    await deleteOrders(ids);
    setReload((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleItemsPerPageChange = useCallback((newValue: number) => {
    setPage(1);
    setItemsPerPage(newValue);
  }, []);

  // useEffect(() => {
  //   async function fetchOrders() {
  //     setLoading(true);
  //     const result = await getOrders(page, itemsperPage);

  //     if (result.ok) {
  //       setOrders(result.body.list);
  //       setTotal(result.body.total);
  //     } else {
  //       toast("error", result.error);
  //     }

  //     setLoading(false);
  //   }

  //   fetchOrders();
  // }, [itemsperPage, page, reload]);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      <Toolbar description="Vendas" showGoBack />

      <TableContainer>
        <DataTable
          columns={orderColumns}
          data={orders}
          onDelete={handleDelete}
          onCreate={() => setIsFormDialogOpen(true)}
          onEdit={handleEdit}
          loading={loading}
          page={page}
          itemsPerPage={itemsperPage}
          total={total}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={handlePageChange}
        />
      </TableContainer>

      <EntityDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        title={editingOrder ? "Editar venda" : "Nova venda"}
        classname="min-w-[80%] min-h-[90%]"
      >
        <OrderForm
          editingOrder={editingOrder}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </EntityDialog>
    </div>
  );
}

export default SalesPage;
