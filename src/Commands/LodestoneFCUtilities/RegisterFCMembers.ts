import {Client, CommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandSubcommandBuilder} from "discord.js";
import {PrimaryCommand, SubCommand} from "../../Handler/Command.ts";
import {ReloadGuildCommands} from "../../Helpers/ReloadCommands.ts";
import {FCMemberList, GetLodestoneFreeCompany, GetLodestoneFreeCompanyMembers} from "../../Helpers/LodestoneHelpers.ts";
import {PrismaClient} from "@prisma/client";

export const RegisterFCMembers: SubCommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('registerfcmembers')
        .setDescription('Gets All Current FC Members from Lodestone FC page and stores in database')
        .addStringOption(option =>
            option
                .setName('fcid')
                .setDescription('The lodestone ID of the Free Company')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('roleid')
                .setDescription('the ID of the role assigned to FC Members')
                .setRequired(true)),

    execute: async (client: Client, interaction: CommandInteraction) => {
        let fcid = "";
        let roleId = "";
        let roleName = "";

        await interaction.reply({content: "Attempting to gather FC Members from lodestone...", ephemeral: false});

        try {

            // Get User FC ID and Role to check User Input
            if (interaction.options.data.length > 0 && interaction.guild) {
                fcid = interaction.options.data[0].options?.[0]?.value as string;
                roleId = interaction.options.data[0].options?.[1]?.value as string;
                roleName = interaction.guild.roles.cache.get(roleId)?.name as string;

                // Grab FC Members from Lodestone
                let FCMemberResult = await GetLodestoneFreeCompanyMembers(fcid);
                await interaction.editReply({content: `${FCMemberResult.members.length} members found, attempting to verify members...`});

                // Get Members that match role ID entered by user
                let guildMembers = await interaction.guild.members.fetch();
                let roleMembers = guildMembers.filter(member => member.roles.cache.hasAny(roleId));

                let verifiedFCMembers: VerifiedFCMember[] = [];
                let unverifiedFCMembers: FCMembersNotVerified[] = [];
                let unverifiedDiscordMembers: DiscordMembersNotVerified[] = [];

                // Loop through each FC Member found from Lodestone and match against discord user with matching user specified role
                FCMemberResult.members.forEach(FCMember => {

                    // Search through Discord Names in order of NickName, Global Name and Username to try and find a match
                    // Kind of Overkill and can remove each layer depending on your requirements

                    // Initially attempts by searching through User Nickname
                    let foundDiscordMember = roleMembers.find(member => member.nickname?.toLowerCase().includes(FCMember.firstName.toLowerCase()) && member.nickname?.toLowerCase().includes(FCMember.lastName.toLowerCase()));

                    if (!foundDiscordMember) {
                        // If Unable to Match through User NickName or NickName doesn't exist, attempt to match through User GlobalName
                        foundDiscordMember = roleMembers.find(member => member.user.username.toLowerCase().includes(FCMember.firstName.toLowerCase()) && member.user.username.toLowerCase().includes(FCMember.lastName.toLowerCase()));
                    }

                    if (!foundDiscordMember) {
                        // Lastly if unable to match through Nickname or Global Name, attempt to match through UserName
                        foundDiscordMember = roleMembers.find(member => member.user.username.toLowerCase().includes(FCMember.firstName.toLowerCase()) && member.user.username.toLowerCase().includes(FCMember.lastName.toLowerCase()));
                    }

                    if (foundDiscordMember) {
                        let verifiedMember: VerifiedFCMember = {
                            DiscordUid: parseInt(foundDiscordMember.id),
                            DiscordUsername: foundDiscordMember.user.username,
                            LodestoneId: FCMember.characterId,
                            DateCreated: new Date(),
                            FirstName: FCMember.firstName,
                            LastName: FCMember.lastName
                        }
                        verifiedFCMembers.push(verifiedMember);
                    } else {
                        // Store Unverified FC Members
                        let unverifiedMember: FCMembersNotVerified = {
                            LodestoneId: FCMember.characterId,
                            FirstName: FCMember.firstName,
                            LastName: FCMember.lastName
                        }
                        unverifiedFCMembers.push(unverifiedMember);
                    }
                });
                // Store Discord Members that are not verified
                roleMembers.forEach(member => {
                    let foundVerifiedMember = verifiedFCMembers.find(verifiedMember => verifiedMember.DiscordUid === parseInt(member.id));
                    if (!foundVerifiedMember) {
                        let unverifiedMember: DiscordMembersNotVerified = {
                            DiscordUid: parseInt(member.id),
                            DiscordUsername: member.user.username,
                            DiscordNickName: member.nickname ? member.nickname : null,
                        }
                        unverifiedDiscordMembers.push(unverifiedMember);
                    }
                });
                await interaction.editReply({content: ` Total FC Members: ${FCMemberResult.members.length} \nVerified FC Members: ${verifiedFCMembers.length} \n Unverified FC Members: ${unverifiedFCMembers.length} \n Unverified Discord Members With Role [${roleName}]: ${unverifiedDiscordMembers.length}`});
            }
        } catch (err) {
            console.error("Error Registering FC Members:", err);
            await interaction.editReply({content: "Error Registering FC Members"});
        }
    }
};

export interface VerifiedFCMember {
    DiscordUid: number;
    DiscordUsername: string;
    LodestoneId: number;
    DateCreated: Date;
    FirstName: string;
    LastName: string;
}

export interface FCMembersNotVerified {
    LodestoneId: number;
    FirstName: string;
    LastName: string;
}

export interface DiscordMembersNotVerified {
    DiscordUid: number;
    DiscordNickName?: string | null;
    DiscordUsername: string;
}
