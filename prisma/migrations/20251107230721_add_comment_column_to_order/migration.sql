/*
  Warnings:

  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Stock` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Stock_productId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Stock_pkey" PRIMARY KEY ("productId");
