/*
  Warnings:

  - You are about to drop the column `user_type` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_type",
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'DEB';
