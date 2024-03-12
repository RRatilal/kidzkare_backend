/*
  Warnings:

  - You are about to drop the `children_on_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parentages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parentages_on_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "children_on_users" DROP CONSTRAINT "children_on_users_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "children_on_users" DROP CONSTRAINT "children_on_users_childId_fkey";

-- DropForeignKey
ALTER TABLE "children_on_users" DROP CONSTRAINT "children_on_users_parentId_fkey";

-- DropForeignKey
ALTER TABLE "parentages_on_users" DROP CONSTRAINT "parentages_on_users_parentId_fkey";

-- DropForeignKey
ALTER TABLE "parentages_on_users" DROP CONSTRAINT "parentages_on_users_parentageId_fkey";

-- DropTable
DROP TABLE "children_on_users";

-- DropTable
DROP TABLE "parentages";

-- DropTable
DROP TABLE "parentages_on_users";

-- CreateTable
CREATE TABLE "parent_child" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "relationship" TEXT NOT NULL,
    "childId" TEXT,
    "parentId" TEXT,
    "avatarId" TEXT,

    CONSTRAINT "parent_child_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parent_child" ADD CONSTRAINT "parent_child_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child" ADD CONSTRAINT "parent_child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child" ADD CONSTRAINT "parent_child_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "avatars"("id") ON DELETE SET NULL ON UPDATE CASCADE;
