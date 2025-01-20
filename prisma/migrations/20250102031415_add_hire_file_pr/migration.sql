-- CreateTable
CREATE TABLE "hireFilePR" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hireFilePR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hireFilePO" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hireFilePO_pkey" PRIMARY KEY ("id")
);
