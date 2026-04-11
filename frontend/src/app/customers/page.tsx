"use client";

import { DataTable } from "@/src/components/DataTable";
import { TableContainer } from "@/src/components/TableContainer";
import { Toolbar } from "@/src/components/Toolbar";
import { useCallback, useEffect, useState } from "react";
import { EntityDialog } from "@/src/components/EntityDialog";
import { CustomerForm } from "./form";
import { toast } from "@/components/ui/sonner";
import { Customer } from "@/src/domains/customer/types";
import { deleteCustomers } from "@/src/domains/customer/services/delete-customers";
import { getCustomers } from "@/src/domains/customer/services/get-customers";
import { customerColumns } from "./columns";

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [itemsperPage, setItemsPerPage] = useState<number>(20);

  function handleCancel() {
    setIsFormDialogOpen(false);
    setEditingCustomer(null);
  }

  function handleSuccess() {
    setIsFormDialogOpen(false);
    setEditingCustomer(null);
    setReload((prev) => !prev);
  }

  const handleEdit = useCallback((rows: Customer[]) => {
    if (!rows || rows.length !== 1) return;

    setEditingCustomer(rows[0]);
    setIsFormDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (rows: Customer[]) => {
    const ids = rows.map((customer) => customer.id);
    await deleteCustomers(ids);
    setReload((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleItemsPerPageChange = useCallback((newValue: number) => {
    setPage(1);
    setItemsPerPage(newValue);
  }, []);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const result = await getCustomers(page, itemsperPage);

      if (result.ok) {
        setCustomers(result.body.list);
        setTotal(result.body.total);
      } else {
        toast("error", result.error);
      }

      setLoading(false);
    }

    fetchCustomers();
  }, [itemsperPage, page, reload]);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      <Toolbar description="Clientes" showGoBack />

      <TableContainer>
        <DataTable
          columns={customerColumns}
          data={customers}
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
        title={editingCustomer ? "Editar cliente" : "Cadastrar cliente"}
      >
        <CustomerForm
          editingCustomer={editingCustomer}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </EntityDialog>
    </div>
  );
}

export default CustomersPage;
