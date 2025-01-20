-- CreateTable
CREATE TABLE "using1" (
    "id" SERIAL NOT NULL,
    "number" INTEGER,
    "name" TEXT,
    "curunumber" TEXT NOT NULL,
    "partnumber" TEXT NOT NULL,
    "brand" TEXT,
    "usenumber" TEXT,
    "detial" TEXT NOT NULL,
    "detialnumber" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "using1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "using10000" (
    "id" SERIAL NOT NULL,
    "number" INTEGER,
    "name" TEXT,
    "curunumber" TEXT NOT NULL,
    "partnumber" TEXT NOT NULL,
    "brand" TEXT,
    "usenumber" TEXT,
    "detial" TEXT NOT NULL,
    "detialnumber" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "using10000_pkey" PRIMARY KEY ("id")
);
