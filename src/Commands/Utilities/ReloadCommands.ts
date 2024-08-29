import {Client, CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "../../Handler/Command.ts";
import {ReloadGuildCommands} from "../../Helpers/ReloadCommands.ts";

export const ReloadCommands: Command = {
    data: new SlashCommandBuilder()
        .setName('reloadcommands')
        .setDescription('Reloads all commands in the guild specifically'),

    execute : async (client: Client, interaction: CommandInteraction) => {
        let content = "";
        let guildId = ""
        if (!interaction.guild) {
            await interaction.reply({ content: "This command can only be run in a guild", ephemeral: true });
            return;
        }  else {
            guildId = interaction.guildId!;

            let result = await ReloadGuildCommands(client, guildId);

            if (result.reloadSuccessful) {
                content = "Commands reloaded successfully";
            } else {
                content = `Error reloading commands: ${result.error}`;
            }

            await interaction.reply({content, ephemeral: true});
        }
    }
};
