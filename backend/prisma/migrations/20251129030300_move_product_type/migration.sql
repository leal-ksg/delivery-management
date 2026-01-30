/*
  Warnings:

  - You are about to drop the column `type` on the `ProductCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PURCHASE';

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "type";
