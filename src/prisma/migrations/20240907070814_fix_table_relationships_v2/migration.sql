/*
  Warnings:

  - You are about to drop the column `FCGuildServerId` on the `GuildAdminRole` table. All the data in the column will be lost.
  - You are about to drop the column `FCMemberId` on the `NameHistory` table. All the data in the column will be lost.
  - Added the required column `DiscordGuildUid` to the `GuildAdminRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiscordUid` to the `NameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GuildAdminRole" DROP CONSTRAINT "GuildAdminRole_FCGuildServerId_fkey";

-- DropForeignKey
ALTER TABLE "NameHistory" DROP CONSTRAINT "NameHistory_FCMemberId_fkey";

-- AlterTable
ALTER TABLE "GuildAdminRole" DROP COLUMN "FCGuildServerId",
ADD COLUMN     "DiscordGuildUid" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "NameHistory" DROP COLUMN "FCMemberId",
ADD COLUMN     "DiscordUid" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "NameHistory" ADD CONSTRAINT "NameHistory_DiscordUid_fkey" FOREIGN KEY ("DiscordUid") REFERENCES "FCMember"("DiscordUid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildAdminRole" ADD CONSTRAINT "GuildAdminRole_DiscordGuildUid_fkey" FOREIGN KEY ("DiscordGuildUid") REFERENCES "FCGuildServer"("DiscordGuildUid") ON DELETE RESTRICT ON UPDATE CASCADE;
