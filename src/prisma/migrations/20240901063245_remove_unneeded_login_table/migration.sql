/*
  Warnings:

  - You are about to drop the `LastLogin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NameChanges` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `AccountMatched` to the `FCMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LastLogin" DROP CONSTRAINT "LastLogin_DiscordUid_fkey";

-- DropForeignKey
ALTER TABLE "NameChanges" DROP CONSTRAINT "NameChanges_DiscordUid_fkey";

-- AlterTable
ALTER TABLE "FCMember" ADD COLUMN     "AccountMatched" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "LastLogin";

-- DropTable
DROP TABLE "NameChanges";

-- CreateTable
CREATE TABLE "NameHistory" (
    "Id" SERIAL NOT NULL,
    "DiscordUid" INTEGER NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "DateChanged" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NameHistory_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "NameHistory" ADD CONSTRAINT "NameHistory_DiscordUid_fkey" FOREIGN KEY ("DiscordUid") REFERENCES "FCMember"("DiscordUid") ON DELETE RESTRICT ON UPDATE CASCADE;
