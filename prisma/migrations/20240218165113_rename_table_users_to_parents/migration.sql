/*
  Warnings:

  - You are about to drop the column `userId` on the `children_on_users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `parentages_on_users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `parentId` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "children_on_users" DROP CONSTRAINT "children_on_users_userId_fkey";

-- DropForeignKey
ALTER TABLE "parentages_on_users" DROP CONSTRAINT "parentages_on_users_userId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- AlterTable
ALTER TABLE "children_on_users" DROP COLUMN "userId",
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "parentages_on_users" DROP COLUMN "userId",
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "userId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dialCode" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "country" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parents_number_key" ON "parents"("number");

-- CreateIndex
CREATE UNIQUE INDEX "parents_email_key" ON "parents"("email");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parentages_on_users" ADD CONSTRAINT "parentages_on_users_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children_on_users" ADD CONSTRAINT "children_on_users_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
