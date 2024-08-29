import {CommandInteraction, Client, SlashCommandBuilder} from "discord.js";
import {Command} from "../../Handler/Command.ts";
//
// // Example of a simple ping command
// // Name of command must be lowercase
// // name: command name to appear in discord
// // description: description of the command to appear in discord
export const Ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    execute : async (client: Client, interaction: CommandInteraction) => {
        const ping = Date.now() - interaction.createdTimestamp;
        const content = `Pong! Latency: ${ping}ms`;
        await interaction.reply({ content, ephemeral: true });
    }
};

