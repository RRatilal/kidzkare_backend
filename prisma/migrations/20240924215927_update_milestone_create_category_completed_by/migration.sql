/*
  Warnings:

  - You are about to drop the column `achieved` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `achievedAt` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `childId` on the `milestones` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `milestones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "milestones" DROP CONSTRAINT "milestones_childId_fkey";

-- AlterTable
ALTER TABLE "milestones" DROP COLUMN "achieved",
DROP COLUMN "achievedAt",
DROP COLUMN "age",
DROP COLUMN "childId",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "completed_by" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "childId" TEXT,
    "milestoneId" TEXT,

    CONSTRAINT "completed_by_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MilestoneCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MilestoneCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_by" ADD CONSTRAINT "completed_by_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_by" ADD CONSTRAINT "completed_by_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
