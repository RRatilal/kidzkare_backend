/*
  Warnings:

  - Added the required column `ageRange` to the `milestones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "milestones" ADD COLUMN     "ageRange" TEXT NOT NULL;
