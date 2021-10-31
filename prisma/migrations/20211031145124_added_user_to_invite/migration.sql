/*
  Warnings:

  - You are about to drop the column `fromUser` on the `Invite` table. All the data in the column will be lost.
  - Added the required column `fromId` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "fromUser",
ADD COLUMN     "fromId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
