"use client";

import { DataTable } from "@/src/components/DataTable";
import { Product } from "@/src/domains/product/types";
import { productColumns } from "./columns";
import { TableContainer } from "@/src/components/TableContainer";
import { Toolbar } from "@/src/components/Toolbar";
import { useCallback, useEffect, useState } from "react";
import { getProducts } from "@/src/domains/product/services/get-products";
import { EntityDialog } from "@/src/components/EntityDialog";
import { ProductForm } from "./form";
import { toast } from "@/components/ui/sonner";
import { deleteProducts } from "@/src/domains/product/services/delete-products";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [itemsperPage, setItemsPerPage] = useState<number>(20);

  function handleCancel() {
    setIsFormDialogOpen(false);
    setEditingProduct(null);
  }

  function handleSuccess() {
    setIsFormDialogOpen(false);
    setEditingProduct(null);
    setReload((prev) => !prev);
  }

  const handleEdit = useCallback((rows: Product[]) => {
    if (!rows || rows.length !== 1) return;

    setEditingProduct(rows[0]);
    setIsFormDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (rows: Product[]) => {
    const ids = rows.map((product) => product.id);
    await deleteProducts(ids);
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
    async function fetchProducts() {
      setLoading(true);
      const result = await getProducts(page, itemsperPage);

      if (result.ok) {
        setProducts(result.body.list);
        setTotal(result.body.total);
      } else {
        toast("error", result.error);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [itemsperPage, page, reload]);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      <Toolbar description="Produtos" showGoBack />

      <TableContainer>
        <DataTable
          columns={productColumns}
          data={products}
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
        title={editingProduct ? "Editar produto" : "Novo produto"}
      >
        <ProductForm
          editingProduct={editingProduct}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </EntityDialog>
    </div>
  );
}

export default ProductsPage;
