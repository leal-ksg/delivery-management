"use client";

import { DataTable } from "@/src/components/DataTable";
import { productColumns } from "./columns";
import { TableContainer } from "@/src/components/TableContainer";
import { Toolbar } from "@/src/components/Toolbar";
import { useCallback, useEffect, useState } from "react";
import { EntityDialog } from "@/src/components/EntityDialog";
import { ProductTreeForm } from "./form";
import { toast } from "@/components/ui/sonner";
import { ProductTree } from "@/src/domains/product-tree/types";
import { getNodes } from "@/src/domains/product-tree/services/get-nodes";
import { deleteNodes } from "@/src/domains/product-tree/services/delete-nodes";

function ProductTreePage() {
  const [nodes, setNodes] = useState<ProductTree[]>([]);
  const [editingNode, setEditingNode] = useState<ProductTree | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [itemsperPage, setItemsPerPage] = useState<number>(20);

  function handleCancel() {
    setIsFormDialogOpen(false);
    setEditingNode(null);
  }

  function handleSuccess() {
    setIsFormDialogOpen(false);
    setEditingNode(null);
    setReload((prev) => !prev);
  }

  const handleEdit = useCallback((rows: ProductTree[]) => {
    if (!rows || rows.length !== 1) return;

    setEditingNode(rows[0]);
    setIsFormDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (rows: ProductTree[]) => {
    const data = rows.map((node) => ({
      childId: node.childId,
      parentId: node.parentId,
    }));
    await deleteNodes(data);
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
    async function fetchNodes() {
      setLoading(true);
      const result = await getNodes(page, itemsperPage);

      if (result.ok) {
        setNodes(result.body.list);
        setTotal(result.body.total);
      } else {
        toast("error", result.error);
      }

      setLoading(false);
    }

    fetchNodes();
  }, [itemsperPage, page, reload]);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      <Toolbar description="Árvore de produtos" showGoBack />

      <TableContainer>
        <DataTable
          columns={productColumns}
          data={nodes}
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
        classname=""
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        title={
          editingNode
            ? "Editar produto da árvore"
            : "Adicionar produto na árvore"
        }
      >
        <ProductTreeForm
          editingProduct={editingNode}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </EntityDialog>
    </div>
  );
}

export default ProductTreePage;
