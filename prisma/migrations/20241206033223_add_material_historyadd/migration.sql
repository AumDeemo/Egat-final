-- CreateTable
CREATE TABLE "ImportHistory" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportHistory" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportHistory" ADD CONSTRAINT "ImportHistory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportHistory" ADD CONSTRAINT "ExportHistory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
