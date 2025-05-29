/*
  Warnings:

  - You are about to alter the column `meatPercentage` on the `Cattle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - You are about to alter the column `fatPercentage` on the `Cattle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Cattle" ALTER COLUMN "meatPercentage" SET DATA TYPE INTEGER,
ALTER COLUMN "fatPercentage" SET DATA TYPE INTEGER;
