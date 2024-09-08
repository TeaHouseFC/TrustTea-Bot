-- DropForeignKey
ALTER TABLE "NameHistory" DROP CONSTRAINT "NameHistory_DiscordUid_fkey";

-- AlterTable
ALTER TABLE "FCMember" ALTER COLUMN "DiscordUid" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "NameHistory" ALTER COLUMN "DiscordUid" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "NameHistory" ADD CONSTRAINT "NameHistory_DiscordUid_fkey" FOREIGN KEY ("DiscordUid") REFERENCES "FCMember"("DiscordUid") ON DELETE RESTRICT ON UPDATE CASCADE;
