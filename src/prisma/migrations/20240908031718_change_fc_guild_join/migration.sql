/*
  Warnings:

  - You are about to drop the column `FCGuildServerId` on the `FCMember` table. All the data in the column will be lost.
  - Added the required column `DiscordGuildUid` to the `FCMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FCMember" DROP CONSTRAINT "FCMember_FCGuildServerId_fkey";

-- AlterTable
ALTER TABLE "FCMember" DROP COLUMN "FCGuildServerId",
ADD COLUMN     "DiscordGuildUid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FCMember" ADD CONSTRAINT "FCMember_DiscordGuildUid_fkey" FOREIGN KEY ("DiscordGuildUid") REFERENCES "FCGuildServer"("DiscordGuildUid") ON DELETE RESTRICT ON UPDATE CASCADE;
