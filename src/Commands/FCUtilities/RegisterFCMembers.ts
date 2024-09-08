import {Client, CommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import { SubCommand} from "../../Handler/Command.ts";
import {GetLodestoneFreeCompanyMembers} from "../../Helpers/LodestoneHelpers.ts";
import {CalculateUnverifiedDiscordMembers, CreateUnverifiedFCMember, CreateVerifiedFCMember, MatchDiscordMemberToFCMember, PrepareMembersToStore, PrepareNameHistoryToStore
} from "../../Helpers/DiscordHelpers.ts";
import {GetFCGuildParameters, StoreFCMembersAndNameHistory} from "../../Helpers/PrismaHelpers.ts";
import {FCMemberNotVerified, VerifiedFCMember} from "../../Types/GenericInterfaces.ts";

export const RegisterFCMembers: SubCommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('registerfcmembers')
        .setDescription('Gets All Current FC Members from Lodestone FC page and stores in database'),

    execute: async (client: Client, interaction: CommandInteraction) => {

        await interaction.reply({content: "Gathering Required FC Data to Process Request...", ephemeral: false});

        try {
            // Get User FC ID and Role to check User Input
            if (interaction.guild && interaction.guildId) {

                // Get Guild Parameters from Database using GuildId from Interaction
                let guildId = interaction.guildId;
                let guildResult = await GetFCGuildParameters(guildId);

                if (guildResult == null || guildResult.DiscordGuildUid === "0") {
                    await interaction.editReply({content: "Error: Guild not registered, please use /registerguildsettings first"});
                    return;
                }

                // Code Smell
                if (guildResult.Roles !== null && guildResult.Roles !== undefined && guildResult.Roles.length > 0) {

                    // Providing status update hinting guild information was found
                    let guildName = interaction.guild.name;
                    await interaction.editReply({content: `Data Found for Guild: ${guildName} \n Attempting to Retrieve FC Members...`});

                    // Grab FC Members from Lodestone
                    let FCMemberResult = await GetLodestoneFreeCompanyMembers(guildResult.FreeCompanyId);

                    // Get Members that match role ID entered by user
                    let guildMembers = await interaction.guild.members.fetch();
                    let guildRoles = interaction.guild.roles.cache;
                    let memberRoleId: string = "";
                    guildResult.Roles.forEach(role => {
                        if (role.RoleType === "FCMEMBER") {
                            memberRoleId = role.RoleId.toString();
                        }
                    })
                    let memberRoleName = "";
                    guildRoles.forEach(role => {
                        if (role.id === memberRoleId) {
                            memberRoleName = role.name;
                        }
                    })

                    let roleMembers = guildMembers.filter(member => member.roles.cache.hasAny(memberRoleId));
                    let verifiedFCMembers: VerifiedFCMember[] = [];
                    let unverifiedFCMembers: FCMemberNotVerified[] = [];

                    // Loop through each FC Member found from Lodestone and match against discord user with matching user specified role
                    FCMemberResult.members.forEach(FCMember => {

                        let foundDiscordMember = MatchDiscordMemberToFCMember(FCMember, roleMembers);

                        if (foundDiscordMember) {
                            let verifiedMember = CreateVerifiedFCMember(foundDiscordMember, FCMember, guildId);
                            verifiedFCMembers.push(verifiedMember);
                        } else {
                            // Store Unverified FC Members
                            let unverifiedMember = CreateUnverifiedFCMember(FCMember);
                            unverifiedFCMembers.push(unverifiedMember);
                        }
                    });
                    // Store Discord Members that are not verified
                    let unverifiedDiscordMembers = CalculateUnverifiedDiscordMembers(roleMembers, verifiedFCMembers);

                    await interaction.editReply({content: ` Total FC Members: ${FCMemberResult.members.length} \n Verified FC Members: ${verifiedFCMembers.length} \n Unverified FC Members: ${unverifiedFCMembers.length} \n Unverified Discord Members With Role [${memberRoleName}]: ${unverifiedDiscordMembers.length} \n Now Attempting to Store FC Members in Database...`});

                    // Creates Objects to Store Members in Database
                    let membersToStore = PrepareMembersToStore(verifiedFCMembers);
                    let nameHistoryToStore = PrepareNameHistoryToStore(verifiedFCMembers)
                    let result = await StoreFCMembersAndNameHistory(membersToStore, nameHistoryToStore);

                    if (result.success) {
                        await interaction.followUp({content: "FC Members Registered Successfully and stored in database"})
                        // await interaction.editReply({content: "FC Members Registered Successfully"});
                    } else {
                        await interaction.editReply({content: "Error Saving FC Members in Database"});
                    }
                }
            }
        } catch (err) {
            console.error("Error Registering FC Members:", err);
            await interaction.editReply({content: "Error Registering FC Members"});
        }
    }
};


