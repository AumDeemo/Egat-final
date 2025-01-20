/*
  Warnings:

  - Made the column `totalAmount` on table `material` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "material" ALTER COLUMN "totalAmount" SET NOT NULL;
