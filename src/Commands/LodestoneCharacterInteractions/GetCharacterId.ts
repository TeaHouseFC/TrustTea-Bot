import {Executor, SubCommand} from "../../Handler/Command.ts";
import {Client, CommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {GetLodestoneCharacterId} from "../../Helpers/LodestoneHelpers.ts";

export const GetCharacterId: SubCommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('getcharacterid')
        .setDescription('Gets the ID of a character')
        .addStringOption(option =>
            option
                .setName('firstname')
                .setDescription('Character first name')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('lastname')
                .setDescription('Character last name')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('world')
                .setDescription('World character is located (default to Carbuncle)')
                .setRequired(false))
    ,
    execute: async (client: Client, interaction: CommandInteraction, executor?: Executor) => {
        let firstName = "";
        let lastName = "";
        let world = "Carbuncle";
        let content = "";
        let result = {success: false, value: ""};

        // Get User Input
        if (interaction.options.data.length > 0 ) {
            firstName = interaction.options.data[0].options?.[0]?.value as string;
            lastName = interaction.options.data[0].options?.[1]?.value as string;
            // Get World Optional Parameter or Default to Carbuncle
            world = interaction.options.data[0].options?.[2]?.value as string || "Carbuncle";
        }

        result = await GetLodestoneCharacterId(firstName, lastName, world);

        if (result.success) {
            content = `Result for [${firstName} ${lastName}] Character ID query: ${result.value}`;
        } else {
            content = `Error: ${result.value}`;
        }

        await interaction.reply({content, ephemeral: true});
    }
};

