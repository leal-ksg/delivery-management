/*
  Warnings:

  - Added the required column `childUnitCost` to the `ProductTree` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductTree" ADD COLUMN     "childUnitCost" DECIMAL(10,2) NOT NULL;
