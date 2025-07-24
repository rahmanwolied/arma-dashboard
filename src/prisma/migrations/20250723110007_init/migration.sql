/*
  Warnings:

  - Added the required column `purchaseLocation` to the `CattlePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `CattleSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CattlePurchase" ADD COLUMN     "purchaseLocation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CattleSale" ADD COLUMN     "customerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CattleSale" ADD CONSTRAINT "CattleSale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
