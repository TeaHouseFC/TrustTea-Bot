import {Client, CommandInteraction,SlashCommandSubcommandBuilder} from "discord.js";
import {ReloadGuildCommands} from "../../Helpers/ReloadCommands.ts";
import {Executor, SubCommand} from "../../Handler/Command.ts";

export const ReloadCommands: SubCommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('reloadcommands')
        .setDescription('Reloads all commands in the guild the command was run'),

    execute : async (client: Client, interaction: CommandInteraction, executor? :Executor) => {
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
