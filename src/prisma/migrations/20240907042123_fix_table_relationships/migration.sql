/*
  Warnings:

  - You are about to drop the column `DiscordGuildUid` on the `FCMember` table. All the data in the column will be lost.
  - You are about to drop the column `DiscordGuildUid` on the `GuildAdminRole` table. All the data in the column will be lost.
  - You are about to drop the column `DiscordUid` on the `NameHistory` table. All the data in the column will be lost.
  - Added the required column `FCGuildServerId` to the `GuildAdminRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FCMemberId` to the `NameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FCGuildServer" DROP CONSTRAINT "FCGuildServer_DiscordGuildUid_fkey";

-- DropForeignKey
ALTER TABLE "GuildAdminRole" DROP CONSTRAINT "GuildAdminRole_DiscordGuildUid_fkey";

-- DropForeignKey
ALTER TABLE "NameHistory" DROP CONSTRAINT "NameHistory_DiscordUid_fkey";

-- DropIndex
DROP INDEX "FCMember_DiscordGuildUid_key";

-- DropIndex
DROP INDEX "GuildAdminRole_DiscordGuildUid_key";

-- AlterTable
ALTER TABLE "FCMember" DROP COLUMN "DiscordGuildUid",
ADD COLUMN     "FCGuildServerId" INTEGER;

-- AlterTable
ALTER TABLE "GuildAdminRole" DROP COLUMN "DiscordGuildUid",
ADD COLUMN     "FCGuildServerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NameHistory" DROP COLUMN "DiscordUid",
ADD COLUMN     "FCMemberId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FCMember" ADD CONSTRAINT "FCMember_FCGuildServerId_fkey" FOREIGN KEY ("FCGuildServerId") REFERENCES "FCGuildServer"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NameHistory" ADD CONSTRAINT "NameHistory_FCMemberId_fkey" FOREIGN KEY ("FCMemberId") REFERENCES "FCMember"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildAdminRole" ADD CONSTRAINT "GuildAdminRole_FCGuildServerId_fkey" FOREIGN KEY ("FCGuildServerId") REFERENCES "FCGuildServer"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
