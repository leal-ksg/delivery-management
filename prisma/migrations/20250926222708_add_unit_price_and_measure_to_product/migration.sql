/*
  Warnings:

  - Added the required column `unitMeasure` to the `PurchaseProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `PurchaseProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PurchaseProduct" ADD COLUMN     "unitMeasure" TEXT NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
