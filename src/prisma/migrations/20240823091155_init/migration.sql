-- CreateTable
CREATE TABLE "FCMember" (
    "Id" SERIAL NOT NULL,
    "DiscordUid" INTEGER NOT NULL,
    "DiscordUsername" TEXT NOT NULL,
    "LodestoneId" INTEGER NOT NULL,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FCMember_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "NameChanges" (
    "Id" SERIAL NOT NULL,
    "DiscordUid" INTEGER NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "DateChanged" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NameChanges_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "LastLogin" (
    "Id" SERIAL NOT NULL,
    "DiscordUid" INTEGER NOT NULL,
    "DaysSinceLastLogin" INTEGER NOT NULL,
    "Past90DaysWithoutLogin" BOOLEAN NOT NULL,
    "Past180DaysWithoutLogin" BOOLEAN NOT NULL,
    "DateLastChecked" TIMESTAMP(3) NOT NULL,
    "DateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LastLogin_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FCMember_DiscordUid_key" ON "FCMember"("DiscordUid");

-- CreateIndex
CREATE UNIQUE INDEX "FCMember_LodestoneId_key" ON "FCMember"("LodestoneId");

-- AddForeignKey
ALTER TABLE "NameChanges" ADD CONSTRAINT "NameChanges_DiscordUid_fkey" FOREIGN KEY ("DiscordUid") REFERENCES "FCMember"("DiscordUid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastLogin" ADD CONSTRAINT "LastLogin_DiscordUid_fkey" FOREIGN KEY ("DiscordUid") REFERENCES "FCMember"("DiscordUid") ON DELETE RESTRICT ON UPDATE CASCADE;
