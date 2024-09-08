/*
  Warnings:

  - A unique constraint covering the columns `[DiscordGuildUid]` on the table `FCMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FCMember" ADD COLUMN     "DiscordGuildUid" BIGINT;

-- CreateTable
CREATE TABLE "FCGuildServer" (
    "Id" SERIAL NOT NULL,
    "DiscordGuildUid" BIGINT NOT NULL,
    "FCId" INTEGER NOT NULL,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FCGuildServer_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "GuildAdminRole" (
    "Id" SERIAL NOT NULL,
    "RoleId" BIGINT NOT NULL,
    "DiscordGuildUid" BIGINT NOT NULL,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuildAdminRole_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FCGuildServer_DiscordGuildUid_key" ON "FCGuildServer"("DiscordGuildUid");

-- CreateIndex
CREATE UNIQUE INDEX "FCGuildServer_FCId_key" ON "FCGuildServer"("FCId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildAdminRole_RoleId_key" ON "GuildAdminRole"("RoleId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildAdminRole_DiscordGuildUid_key" ON "GuildAdminRole"("DiscordGuildUid");

-- CreateIndex
CREATE UNIQUE INDEX "FCMember_DiscordGuildUid_key" ON "FCMember"("DiscordGuildUid");

-- AddForeignKey
ALTER TABLE "FCGuildServer" ADD CONSTRAINT "FCGuildServer_DiscordGuildUid_fkey" FOREIGN KEY ("DiscordGuildUid") REFERENCES "FCMember"("DiscordGuildUid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildAdminRole" ADD CONSTRAINT "GuildAdminRole_DiscordGuildUid_fkey" FOREIGN KEY ("DiscordGuildUid") REFERENCES "FCGuildServer"("DiscordGuildUid") ON DELETE RESTRICT ON UPDATE CASCADE;
