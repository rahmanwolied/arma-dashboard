/*
  Warnings:

  - You are about to drop the column `actualSalePrice` on the `transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedSalePrice` on the `transaction_items` table. All the data in the column will be lost.
  - Added the required column `actualSalePriceKg` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedSalePriceKg` to the `transaction_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_items" DROP COLUMN "actualSalePrice",
DROP COLUMN "estimatedSalePrice",
ADD COLUMN     "actualSalePriceKg" INTEGER NOT NULL,
ADD COLUMN     "estimatedSalePriceKg" INTEGER NOT NULL;
