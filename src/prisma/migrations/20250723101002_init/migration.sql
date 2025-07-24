/*
  Warnings:

  - You are about to drop the column `fatPercentage` on the `Cattle` table. All the data in the column will be lost.
  - You are about to drop the column `liveWeight` on the `Cattle` table. All the data in the column will be lost.
  - You are about to drop the column `meatPercentage` on the `Cattle` table. All the data in the column will be lost.
  - You are about to drop the column `purchasePricePerKg` on the `Cattle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cattlePurchaseId]` on the table `Cattle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cattleSaleId]` on the table `Cattle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cattlePurchaseId` to the `Cattle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cattleSaleId` to the `Cattle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cattle" DROP COLUMN "fatPercentage",
DROP COLUMN "liveWeight",
DROP COLUMN "meatPercentage",
DROP COLUMN "purchasePricePerKg",
ADD COLUMN     "cattlePurchaseId" TEXT NOT NULL,
ADD COLUMN     "cattleSaleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CattlePurchase" (
    "id" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchasePricePerKg" INTEGER NOT NULL,
    "liveWeight" INTEGER NOT NULL,
    "meatPercentage" INTEGER NOT NULL,
    "fatPercentage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CattlePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CattleSale" (
    "id" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "salePricePerKg" INTEGER NOT NULL,
    "liveWeight" INTEGER NOT NULL,
    "meatPercentage" INTEGER NOT NULL,
    "fatPercentage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CattleSale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cattle_cattlePurchaseId_key" ON "Cattle"("cattlePurchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Cattle_cattleSaleId_key" ON "Cattle"("cattleSaleId");

-- AddForeignKey
ALTER TABLE "Cattle" ADD CONSTRAINT "Cattle_cattlePurchaseId_fkey" FOREIGN KEY ("cattlePurchaseId") REFERENCES "CattlePurchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cattle" ADD CONSTRAINT "Cattle_cattleSaleId_fkey" FOREIGN KEY ("cattleSaleId") REFERENCES "CattleSale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
