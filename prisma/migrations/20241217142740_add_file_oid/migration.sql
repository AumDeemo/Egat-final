/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FileOid" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileOid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "material_name_key" ON "material"("name");
