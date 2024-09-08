/*
  Warnings:

  - You are about to drop the `GuildAdminRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FCMEMBER', 'FCADMIN');

-- DropForeignKey
ALTER TABLE "GuildAdminRole" DROP CONSTRAINT "GuildAdminRole_DiscordGuildUid_fkey";

-- DropTable
DROP TABLE "GuildAdminRole";

-- CreateTable
CREATE TABLE "FCGuildRole" (
    "Id" SERIAL NOT NULL,
    "RoleId" BIGINT NOT NULL,
    "DiscordGuildUid" BIGINT NOT NULL,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "RoleType" "Role" NOT NULL,

    CONSTRAINT "FCGuildRole_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FCGuildRole_RoleId_key" ON "FCGuildRole"("RoleId");

-- AddForeignKey
ALTER TABLE "FCGuildRole" ADD CONSTRAINT "FCGuildRole_DiscordGuildUid_fkey" FOREIGN KEY ("DiscordGuildUid") REFERENCES "FCGuildServer"("DiscordGuildUid") ON DELETE RESTRICT ON UPDATE CASCADE;
