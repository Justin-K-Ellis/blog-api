/*
  Warnings:

  - You are about to drop the column `commentId` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "commentId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isAdmin" SET DEFAULT false;
