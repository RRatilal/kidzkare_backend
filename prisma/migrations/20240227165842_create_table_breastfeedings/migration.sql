-- CreateTable
CREATE TABLE "Breastfeeding" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "advantage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videos" TEXT,
    "images" TEXT,

    CONSTRAINT "Breastfeeding_pkey" PRIMARY KEY ("id")
);
