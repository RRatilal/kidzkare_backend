/*
  Warnings:

  - You are about to drop the `Breastfeeding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Breastfeeding";

-- CreateTable
CREATE TABLE "breastfeedings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "advantage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videos" TEXT,
    "images" TEXT,

    CONSTRAINT "breastfeedings_pkey" PRIMARY KEY ("id")
);
