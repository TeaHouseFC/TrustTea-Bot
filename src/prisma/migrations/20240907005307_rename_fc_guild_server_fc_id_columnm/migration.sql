/*
  Warnings:

  - You are about to drop the column `FCId` on the `FCGuildServer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[FreeCompanyId]` on the table `FCGuildServer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `FreeCompanyId` to the `FCGuildServer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FCGuildServer_FCId_key";

-- AlterTable
ALTER TABLE "FCGuildServer" DROP COLUMN "FCId",
ADD COLUMN     "FreeCompanyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FCGuildServer_FreeCompanyId_key" ON "FCGuildServer"("FreeCompanyId");
