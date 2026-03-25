"use client";

import { DataTable } from "@/src/components/DataTable";
import { Product } from "@/src/domains/product/types";
import { productColumns } from "./columns";
import { TableContainer } from "@/src/components/TableContainer";
import { Toolbar } from "@/src/components/Toolbar";
import { useEffect, useState } from "react";
import { getProducts } from "@/src/domains/product/services/get-products";
import { EntityDialog } from "@/src/components/EntityDialog";
import { ProductForm } from "./form";
import { toast } from "@/components/ui/sonner";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  function handleCancel() {
    setIsFormDialogOpen(false);
    setEditingProduct(null);
  }

  function handleSuccess() {
    setIsFormDialogOpen(false);
    setEditingProduct(null);
    setReload((prev) => !prev);
  }

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const result = await getProducts();

      if (result.ok) {
        setProducts(result.body);
      } else {
        toast("error", result.error);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [reload]);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      <Toolbar description="Produtos" showGoBack />

      <TableContainer>
        <DataTable
          columns={productColumns}
          data={products}
          onDelete={() => {}}
          onCreate={() => setIsFormDialogOpen(true)}
          loading={loading}
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
