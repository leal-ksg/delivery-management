-- CreateEnum
CREATE TYPE "ConsumptionType" AS ENUM ('PRODUCTION', 'SALE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "consumptionType" "ConsumptionType" NOT NULL DEFAULT 'PRODUCTION';
