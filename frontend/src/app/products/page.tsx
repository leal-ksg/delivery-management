"use client";

import { DataTable } from "@/src/components/DataTable";
import {
  ConsumptionType,
  Product,
  ProductType,
} from "@/src/domains/product/types";
import { productColumns } from "./columns";
import { TableContainer } from "@/src/components/TableContainer";
import { Toolbar } from "@/src/components/Toolbar";

function ProductsPage() {
  const mockProducts: Product[] = [
    {
      id: "uuid-001",
      active: true,
      name: "PEDAL DE EFEITO PARA GUITARRA CUVAVE PRETO",
      description: "Pedal de distorção de alta qualidade",
      unitPrice: 229.31,
      categoryId: 1,
      type: ProductType.SALE,
      consumptionType: ConsumptionType.SALE,
      minStock: 10,
      status: "Alô",
      category: "EQUIPAMENTOS PARA GUITARRA",
      createdAt: new Date("2023-10-01T10:00:00Z"),
    },
    {
      id: "uuid-002",
      active: true,
      name: "CAMISA POLO UNIFORME KAIROS",
      description: "Uniforme padrão para funcionários",
      unitPrice: 55.9,
      categoryId: 2,
      type: ProductType.PURCHASE,
      consumptionType: ConsumptionType.PRODUCTION,
      minStock: 5,
      category: "VESTUÁRIO",
      createdAt: new Date("2023-10-05T14:30:00Z"),
    },
    {
      id: "uuid-003",
      active: true,
      name: "SHOULDER BAG UNISEX KAIROS",
      description: "Bolsa transversal com logo bordado",
      unitPrice: 180.0,
      categoryId: 2,
      type: ProductType.SALE,
      consumptionType: ConsumptionType.SALE,
      minStock: 15,
      category: "VESTUÁRIO",
      createdAt: new Date("2023-10-10T09:15:00Z"),
    },
    {
      id: "uuid-004",
      active: false,
      name: "CAIXA DE PAPELÃO PERSONALIZADA P",
      description: "Caixa para envio de pedais",
      unitPrice: 4.5,
      categoryId: 3,
      type: ProductType.PACKAGING,
      consumptionType: ConsumptionType.PRODUCTION,
      minStock: 100,
      category: "EMBALAGENS",
      createdAt: new Date("2023-11-01T11:20:00Z"),
    },
    {
      id: "uuid-005",
      active: true,
      name: "PLACA DE CIRCUITO IMPRESSO LOTE",
      description: "Placas base para montagem dos pedais",
      unitPrice: 15.2,
      categoryId: 4,
      type: ProductType.PURCHASE,
      consumptionType: ConsumptionType.PRODUCTION,
      minStock: 50,
      category: "MATÉRIA PRIMA",
      createdAt: new Date("2023-11-15T16:45:00Z"),
    },
    {
      id: "uuid-006",
      active: true,
      name: "CABO P10 / P10 5 METROS",
      description: "Cabo de áudio profissional",
      unitPrice: 45.0,
      categoryId: 1,
      type: ProductType.SALE,
      consumptionType: ConsumptionType.SALE,
      minStock: 20,
      category: "ACESSÓRIOS",
      createdAt: new Date("2023-12-02T08:00:00Z"),
    },
    {
      id: "uuid-007",
      active: false,
      name: "ADESIVO KAIROS HOLOGRÁFICO",
      description: "Brinde enviado junto com os produtos",
      unitPrice: 1.2,
      categoryId: 3,
      type: ProductType.PACKAGING,
      consumptionType: ConsumptionType.PRODUCTION,
      minStock: 200,
      category: "EMBALAGENS",
      createdAt: new Date("2024-01-10T13:10:00Z"),
    },
    {
      id: "uuid-008",
      active: true,
      name: "KNOB DE ALUMÍNIO PRETO",
      description: "Botão rotativo para potenciômetro",
      unitPrice: 8.9,
      categoryId: 4,
      type: ProductType.PURCHASE,
      consumptionType: ConsumptionType.PRODUCTION,
      minStock: 80,
      category: "MATÉRIA PRIMA",
      createdAt: new Date("2024-01-20T15:00:00Z"),
    },
    {
      id: "uuid-009",
      active: true,
      name: "PLÁSTICO BOLHA BOBINA 100M",
      description: "Material para proteção no envio",
      unitPrice: 85.0,
      categoryId: 3,
      type: ProductType.PACKAGING,
      consumptionType: ConsumptionType.PRODUCTION,
      minStock: 2,
      category: "EMBALAGENS",
      createdAt: new Date("2024-02-05T09:30:00Z"),
    },
    {
      id: "uuid-010",
      active: false,
      name: "CAMISA POLO UNIFORME KAIROS (MODELO ANTIGO)",
      description: "Uniforme descontinuado",
      unitPrice: 45.0,
      categoryId: 2,
      type: ProductType.PURCHASE,
      consumptionType: ConsumptionType.PRODUCTION,
      minStock: 0,
      category: "VESTUÁRIO",
      createdAt: new Date("2022-05-10T10:00:00Z"),
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      {/* Header com titulo */}
      <Toolbar description="Produtos" showGoBack/>

      {/* Tabela de CRUD */}
      <TableContainer>
        <DataTable
          columns={productColumns}
          data={mockProducts}
          onDelete={() => "teste"}
        />
      </TableContainer>
    </div>
  );
}

export default ProductsPage;
