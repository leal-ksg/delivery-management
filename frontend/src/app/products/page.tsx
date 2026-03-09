"use client";

import { DataTable } from "@/src/components/DataTable";
import { Product } from "@/src/domains/product/types";
import { productColumns } from "./columns";
import { TableContainer } from "@/src/components/TableContainer";
import { Toolbar } from "@/src/components/Toolbar";
import { useEffect, useState } from "react";
import { getProducts } from "@/src/domains/product/services/get-products";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const result = await getProducts();

      if (result.ok) {
        setProducts(result.body);
      } else {
        console.log(result.error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      {/* Header com titulo */}
      <Toolbar description="Produtos" showGoBack />

      {/* Tabela de CRUD */}
      <TableContainer>
        <DataTable
          columns={productColumns}
          data={products}
          onDelete={() => "teste"}
        />
      </TableContainer>
    </div>
  );
}

export default ProductsPage;
