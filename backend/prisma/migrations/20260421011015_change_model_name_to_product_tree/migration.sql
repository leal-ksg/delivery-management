/*
  Warnings:

  - You are about to drop the `MaterialTree` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MaterialTree" DROP CONSTRAINT "MaterialTree_childId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialTree" DROP CONSTRAINT "MaterialTree_parentId_fkey";

-- DropTable
DROP TABLE "MaterialTree";

-- CreateTable
CREATE TABLE "ProductTree" (
    "parentId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "childQuantity" INTEGER NOT NULL,

    CONSTRAINT "ProductTree_pkey" PRIMARY KEY ("childId","parentId")
);

-- AddForeignKey
ALTER TABLE "ProductTree" ADD CONSTRAINT "ProductTree_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTree" ADD CONSTRAINT "ProductTree_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
