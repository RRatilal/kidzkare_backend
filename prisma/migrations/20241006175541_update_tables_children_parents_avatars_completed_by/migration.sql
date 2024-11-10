/*
  Warnings:

  - You are about to drop the column `avatarId` on the `parent_child` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "parent_child" DROP CONSTRAINT "parent_child_avatarId_fkey";

-- AlterTable
ALTER TABLE "avatars" ADD COLUMN     "driveFileId" TEXT;

-- AlterTable
ALTER TABLE "children" ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "watermelon_id" TEXT;

-- AlterTable
ALTER TABLE "completed_by" ADD COLUMN     "completionDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "parent_child" DROP COLUMN "avatarId";

-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "watermelon_id" TEXT;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "avatars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "avatars"("id") ON DELETE SET NULL ON UPDATE CASCADE;
