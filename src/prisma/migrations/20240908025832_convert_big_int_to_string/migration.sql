-- DropForeignKey
ALTER TABLE "FCGuildRole" DROP CONSTRAINT "FCGuildRole_DiscordGuildUid_fkey";

-- DropForeignKey
ALTER TABLE "NameHistory" DROP CONSTRAINT "NameHistory_DiscordUid_fkey";

-- AlterTable
ALTER TABLE "FCGuildRole" ALTER COLUMN "RoleId" SET DATA TYPE TEXT,
ALTER COLUMN "DiscordGuildUid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FCGuildServer" ALTER COLUMN "DiscordGuildUid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FCMember" ALTER COLUMN "DiscordUid" SET DATA TYPE TEXT,
ALTER COLUMN "LodestoneId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "NameHistory" ALTER COLUMN "DiscordUid" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "NameHistory" ADD CONSTRAINT "NameHistory_DiscordUid_fkey" FOREIGN KEY ("DiscordUid") REFERENCES "FCMember"("DiscordUid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FCGuildRole" ADD CONSTRAINT "FCGuildRole_DiscordGuildUid_fkey" FOREIGN KEY ("DiscordGuildUid") REFERENCES "FCGuildServer"("DiscordGuildUid") ON DELETE RESTRICT ON UPDATE CASCADE;
