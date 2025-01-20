-- CreateTable
CREATE TABLE "Forklift" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "num" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "carry" TEXT NOT NULL,
    "carNum" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Forklift_pkey" PRIMARY KEY ("id")
);
