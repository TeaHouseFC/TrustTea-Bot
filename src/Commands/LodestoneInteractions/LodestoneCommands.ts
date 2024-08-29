import {Client, CommandInteraction, SlashCommandBuilder} from "discord.js";


import {Command} from "../../Handler/Command.ts";
import {GetLodestoneCharacterId, GetLodestoneFreeCompany} from "../../Helpers/LodestoneHelpers.ts";

export const lodestoneCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('lodestone')
        .setDescription('Handles interactions using the lodestone')
        .addSubcommand(subcommand =>
            subcommand
                .setName('getcharacterfc')
                .setDescription('Searches the Lodestone for a character and returns character FC')
                .addStringOption(option =>
                    option
                        .setName('firstname')
                        .setDescription('Character first name')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('lastname')
                        .setDescription('Character last name')
                        .setRequired(true)
                )
        )
    .addSubcommand(subcommand =>
        subcommand
            .setName('getcharacterid')
            .setDescription('Searches the Lodestone for a character and returns character character Id')
            .addStringOption(option =>
                option
                    .setName('firstname')
                    .setDescription('Character first name')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('lastname')
                    .setDescription('Character last name')
                    .setRequired(true)
            )
    ),
    execute : async (client: Client, interaction: CommandInteraction) => {
        let firstName = "";
        let lastName = "";
        let content = "";
        let result = {success: false, value: ""};
        // Get User Input
        if (interaction.options.data.length > 0 ) {
            firstName = interaction.options.data[0].options?.[0]?.value as string;
            lastName = interaction.options.data[0].options?.[1]?.value as string;
        }
        // Get the subcommand and execute action
        if (interaction.options.data.length === 1 && interaction.options.data[0].name === 'getcharacterid') {
            result = await GetLodestoneCharacterId(firstName, lastName);
                content = `Result for [${firstName} ${lastName}] Character ID query: ${result.value}`;
        } else {
            result = await GetLodestoneFreeCompany(firstName, lastName);
            content = `Result for [${firstName} ${lastName}] Free Company query: ${result.value}`;
        }

        await interaction.reply({ content, ephemeral: true });
    }
};

export default lodestoneCommand;