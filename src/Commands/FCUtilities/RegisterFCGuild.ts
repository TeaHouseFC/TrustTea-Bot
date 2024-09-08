import {Executor, SubCommand} from "../../Handler/Command.ts";
import {Client, CommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {PrismaClient} from "@prisma/client";
import {StoreFCGuildParameters} from "../../Helpers/PrismaHelpers.ts";


export const RegisterFCGuild: SubCommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('registerguild')
        .setDescription('Registers the guild member role, admin role as well as the Free Company Id')
        .addRoleOption(option =>
            option
                .setName('adminrole')
                .setDescription('Role to register as guild admin')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('memberrole')
                .setDescription('Role to register as guild member')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('fcid')
                .setDescription('The lodestone ID of the Free Company')
                .setRequired(true)),
    execute: async (client: Client, interaction: CommandInteraction, executor?: Executor) => {

        await interaction.reply({content: "Attempting to register guild admin role...", ephemeral: false});

        // Get User Input
        const adminRoleId = interaction.options.data[0].options?.[0]?.value as string;
        const adminRoleName = interaction.options.data[0].options?.[0]?.role?.name as string;
        const memberRoleId = interaction.options.data[0].options?.[1]?.value as string;
        const memberRoleName = interaction.options.data[0].options?.[1]?.role?.name as string
        const fcId = interaction.options.data[0].options?.[2]?.value as string;
        const guildId = interaction.guildId;

        if (guildId) {
            // Check if Guild is stored in db
            try {
                const prisma = new PrismaClient();
                const existingGuild = await prisma.fCGuildServer.findUnique({
                    where: {
                        DiscordGuildUid: guildId
                    }
                })

                // Return Guild Already Registered if Guild is found
                // Otherwise Create Guild Record In DB
                // TODO Add UpdateGuildSettings Command
                if (existingGuild) {
                    await interaction.editReply({content: `Error: Guild already registered, please use /updateguild instead`});
                } else {

                    let newRoleResult = await StoreFCGuildParameters(guildId, memberRoleId, adminRoleId, fcId);
                    if (newRoleResult.success) {
                        await interaction.editReply({content: `Role [${adminRoleName}] registered as guild admin and [${memberRoleName}] registered as guild member`});
                    } else {
                        await interaction.editReply({content: `Error: Unable to save roles in the database, please try again`});
                    }
                }
            }
            catch (err) {
                console.log(err);
                await interaction.editReply({content: `Error: Unexpected Error while running command`});
            }
        } else {
            await interaction.editReply({content: `Error: Unable to retrieve guild ID, please try again`});
        }
    }
}