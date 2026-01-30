-- CreateTable
CREATE TABLE "MaterialTree" (
    "parentId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "childQuantity" INTEGER NOT NULL,

    CONSTRAINT "MaterialTree_pkey" PRIMARY KEY ("childId","parentId")
);

-- AddForeignKey
ALTER TABLE "MaterialTree" ADD CONSTRAINT "MaterialTree_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialTree" ADD CONSTRAINT "MaterialTree_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
