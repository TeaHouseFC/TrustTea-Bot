import {PrismaClient} from "@prisma/client";
import {FCGuildParameters, FCMemberToSave, NameHistoryToSave, ServiceResult} from "../Types/GenericInterfaces.ts";


export function StoreFCMembersAndNameHistory(membersToStore: FCMemberToSave[], nameHistoryToStore: NameHistoryToSave[]): Promise<ServiceResult> {
    return new Promise<ServiceResult>(async (resolve, reject) => {
        try {
            // Save the records in one transaction to ensure Atomicity
            // In the event the transaction fails, the entire transaction will be rolled back
            const prisma = new PrismaClient();
            await prisma.$transaction(async (prisma) => {
                await prisma.fCMember.createMany({
                    data: membersToStore
                });

                await prisma.nameHistory.createMany({
                    data: nameHistoryToStore
                });
            })
            resolve({ success: true, value: "FC Members and Name History stored successfully" });
        } catch (err) {
            reject({ success: false, value: `Error storing FC Members and Name History: ${err}` });
        }
    });
}


export function StoreFCGuildParameters(guildId: string, memberRoleId: string, adminRoleId: string, fcId: string): Promise<ServiceResult> {
    return new Promise<ServiceResult>(async (resolve, reject) => {
        try {
            const prisma = new PrismaClient();
            // Save all or none
            await prisma.$transaction(async (prisma) => {
                await prisma.fCGuildServer.create({
                    data: {
                        DiscordGuildUid: guildId,
                        FreeCompanyId: fcId,
                        DateCreated: new Date()
                    }
                });
                await prisma.fCGuildRole.create({
                    data: {
                        DiscordGuildUid: guildId,
                        RoleId: adminRoleId,
                        DateCreated: new Date(),
                        RoleType: "FCADMIN"
                    }
                })
                await prisma.fCGuildRole.create({
                    data: {
                        DiscordGuildUid: guildId,
                        RoleId: memberRoleId,
                        DateCreated: new Date(),
                        RoleType: "FCMEMBER"
                    }
                })
            });
            resolve({ success: true, value: "Guild Config stored successfully" });
        } catch (err) {
            reject({ success: false, value: `Error storing Guild Config: ${err}` });
        }
    });
}

export function GetFCGuildParameters(guildId: string): Promise<FCGuildParameters> {
    return new Promise<FCGuildParameters>(async (resolve, reject) => {
        try {
            const prisma = new PrismaClient();
            const guildConfig = await prisma.fCGuildServer.findUnique({
                where: {
                    DiscordGuildUid: guildId
                },
            });

            // Initialise Empty Object that can be returned in the event no guild config or roles are found
            let fcGuildParameters: FCGuildParameters = {
                Id: 0,
                DiscordGuildUid: "",
                FreeCompanyId: "",
                DateCreated: new Date(),
                Roles: []
            };

            if (guildConfig) {
                let guildRoles = await prisma.fCGuildRole.findMany({
                    where: {
                        DiscordGuildUid: guildId
                    }
                });

                fcGuildParameters = {
                    Id: guildConfig.Id,
                    DiscordGuildUid: guildConfig.DiscordGuildUid,
                    FreeCompanyId: guildConfig.FreeCompanyId,
                    DateCreated: guildConfig.DateCreated,
                    Roles: guildRoles
                }
            }

            resolve(fcGuildParameters);
        } catch (err) {
            reject({ success: false, value: `Error getting Guild Config: ${err}` });
        }
    });
}