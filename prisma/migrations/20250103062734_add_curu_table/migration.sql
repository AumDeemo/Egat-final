/*
  Warnings:

  - You are about to drop the column `path` on the `curu` table. All the data in the column will be lost.
  - You are about to drop the `using1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `using10000` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `curunumber` to the `curu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detial` to the `curu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partnumber` to the `curu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `curu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "curu" DROP COLUMN "path",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "curunumber" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "detial" TEXT NOT NULL,
ADD COLUMN     "detialnumber" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "number" INTEGER,
ADD COLUMN     "partnumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usenumber" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "using1";

-- DropTable
DROP TABLE "using10000";
