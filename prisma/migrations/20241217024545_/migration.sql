/*
  Warnings:

  - You are about to drop the column `imagePath` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Machine` table. All the data in the column will be lost.
  - Added the required column `carNum` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carry` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Machine` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Machine_number_key";

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "imagePath",
DROP COLUMN "number",
DROP COLUMN "plateNumber",
DROP COLUMN "weight",
ADD COLUMN     "carNum" TEXT NOT NULL,
ADD COLUMN     "carry" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "num" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
