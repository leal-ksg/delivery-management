"use client";

import { DataTable } from "@/src/components/DataTable";
import { productColumns } from "./columns";
import { TableContainer } from "@/src/components/TableContainer";
import { useCallback, useEffect, useState } from "react";
import { EntityDialog } from "@/src/components/EntityDialog";
import { UpdateProductTreeForm } from "./update-form";
import { toast } from "@/components/ui/sonner";
import { ProductTree } from "@/src/domains/product-tree/types";
import { getNodes } from "@/src/domains/product-tree/services/get-nodes";
import { deleteNodes } from "@/src/domains/product-tree/services/delete-nodes";
import { usePageToolbar } from "@/hooks/use-page-toolbar";
import { ParentSearch } from "./parent-search";
import { CreationProductTreeForm } from "./creation-form";

function ProductTreePage() {
  const [parentId, setParentId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<ProductTree[]>([]);
  const [editingNode, setEditingNode] = useState<ProductTree | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [itemsperPage, setItemsPerPage] = useState<number>(20);

  usePageToolbar("Árvore de produtos", true);

  function handleCancel() {
    setIsCreateDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setEditingNode(null);
  }

  function handleSuccess() {
    setIsCreateDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setEditingNode(null);
    setReload((prev) => !prev);
  }

  const handleEdit = useCallback((rows: ProductTree[]) => {
    if (!rows || rows.length !== 1) return;

    setEditingNode(rows[0]);
    setIsUpdateDialogOpen(true);
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

  const handleParentSearch = useCallback(
    (id: string) => {
      if (id === parentId) return;

      setNodes([]);
      setParentId(id);
    },
    [parentId],
  );

  useEffect(() => {
    console.log(parentId)
  }, [parentId])

  useEffect(() => {
    async function fetchNodes() {
      if (!parentId) return;

      setLoading(true);
      console.log(parentId);
      const result = await getNodes(parentId, page, itemsperPage);

      if (result.ok) {
        setNodes(result.body.list);
        setTotal(result.body.total);
      } else {
        toast("error", result.error);
      }

      setLoading(false);
    }

    fetchNodes();
  }, [itemsperPage, page, parentId, reload]);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      <ParentSearch onSearch={handleParentSearch} isLoading={loading}/>

      <TableContainer>
        <DataTable
          columns={productColumns}
          data={nodes}
          onDelete={handleDelete}
          onCreate={!parentId ? undefined : () => setIsCreateDialogOpen(true)}
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
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Adicionar produtos na árvore"
      >
        <CreationProductTreeForm
          parentId={parentId}
          existingProducts={nodes}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </EntityDialog>

      <EntityDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        title="Editar produto na árvore"
      >
        <UpdateProductTreeForm
          parentId={parentId}
          editingProduct={editingNode}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </EntityDialog>
    </div>
  );
}

export default ProductTreePage;
