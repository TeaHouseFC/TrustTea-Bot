import {FCMemberNotVerified, ServiceResult, VerifiedFCMember} from "../Types/GenericInterfaces.ts";
import {GetFCGuildParameters} from "./PrismaHelpers.ts";
import {GetLodestoneFreeCompanyMembers} from "./LodestoneHelpers.ts";
import {Client} from "discord.js";
import {
    CalculateUnverifiedDiscordMembers,
    CreateUnverifiedFCMember,
    CreateVerifiedFCMember,
    MatchDiscordMemberToFCMember
} from "./GuildMemberHelpers.ts";


export async function CheckForNameChange(client: Client): Promise<ServiceResult> {
    try {
        const guildParameters = await GetFCGuildParameters();

        for (const FCGuild of guildParameters) {
            const LodestoneFCMembers = await GetLodestoneFreeCompanyMembers(FCGuild.FreeCompanyId);
            const guild = await client.guilds.fetch(FCGuild.DiscordGuildUid);
            const guildMembers = await guild.members.fetch();

            if (FCGuild.Roles !== null && FCGuild.Roles !== undefined && FCGuild.Roles.length > 0) {
                let memberRoleId: string = "";
                FCGuild.Roles.forEach(role => {
                    if (role.RoleType === "FCMEMBER") {
                        memberRoleId = role.RoleId.toString();
                    }
                })

                let roleMembers = guildMembers.filter(member => member.roles.cache.hasAny(memberRoleId));
                let verifiedFCMembers: VerifiedFCMember[] = [];
                let unverifiedFCMembers: FCMemberNotVerified[] = [];

                // Loop through each FC Member Found from Lodestone and match against discord user with matching user specified role
                LodestoneFCMembers.members.forEach(FCMember => {

                    let foundDiscordMember = MatchDiscordMemberToFCMember(FCMember, roleMembers);

                    if (foundDiscordMember) {
                        let verifiedMember = CreateVerifiedFCMember(foundDiscordMember, FCMember, FCGuild.DiscordGuildUid);
                        verifiedFCMembers.push(verifiedMember);
                    } else {
                        // Store Unverified FC Members
                        let unverifiedMember = CreateUnverifiedFCMember(FCMember);
                        unverifiedFCMembers.push(unverifiedMember);
                    }
                });

                // Store Discord Members that are not verified
                let unverifiedDiscordMembers = CalculateUnverifiedDiscordMembers(roleMembers, verifiedFCMembers);

                // Now to see if Names have changed between what's on the lodestone and their discord nickname


            }
        }


        return { success: true, value: "Name change check completed" };
    } catch (error) {
        return { success: false, value: `Error: ${error}` };
    }
}


export async function CheckForNewCharacter(client: Client): Promise<ServiceResult> {
    try {
        const guildParameters = await GetFCGuildParameters();

        for (const FCGuild of guildParameters) {
            const LodestoneFCMembers = await GetLodestoneFreeCompanyMembers(FCGuild.FreeCompanyId);
            const guild = await client.guilds.fetch(FCGuild.DiscordGuildUid);
            const guildMembers = await guild.members.fetch();

            if (FCGuild.Roles !== null && FCGuild.Roles !== undefined && FCGuild.Roles.length > 0) {
                let memberRoleId: string = "";
                FCGuild.Roles.forEach(role => {
                    if (role.RoleType === "FCMEMBER") {
                        memberRoleId = role.RoleId.toString();
                    }
                })

                let roleMembers = guildMembers.filter(member => member.roles.cache.hasAny(memberRoleId));
                let verifiedFCMembers: VerifiedFCMember[] = [];
                let unverifiedFCMembers: FCMemberNotVerified[] = [];

                // Loop through each FC Member Found from Lodestone and match against discord user with matching user specified role
                LodestoneFCMembers.members.forEach(FCMember => {

                    let foundDiscordMember = MatchDiscordMemberToFCMember(FCMember, roleMembers);

                    if (foundDiscordMember) {
                        let verifiedMember = CreateVerifiedFCMember(foundDiscordMember, FCMember, FCGuild.DiscordGuildUid);
                        verifiedFCMembers.push(verifiedMember);
                    } else {
                        // Store Unverified FC Members
                        let unverifiedMember = CreateUnverifiedFCMember(FCMember);
                        unverifiedFCMembers.push(unverifiedMember);
                    }
                });

                // Store Discord Members that are not verified
                let unverifiedDiscordMembers = CalculateUnverifiedDiscordMembers(roleMembers, verifiedFCMembers);

                // Loop through database to find any new characters that have joined the FC




            }
        }


        return { success: true, value: "Name change check completed" };
    } catch (error) {
        return { success: false, value: `Error: ${error}` };
    }
}