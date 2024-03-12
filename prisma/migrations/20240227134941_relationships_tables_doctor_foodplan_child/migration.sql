/*
  Warnings:

  - Added the required column `childId` to the `food_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `food_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "food_plans" ADD COLUMN     "childId" TEXT NOT NULL,
ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "food_plans" ADD CONSTRAINT "food_plans_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_plans" ADD CONSTRAINT "food_plans_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
