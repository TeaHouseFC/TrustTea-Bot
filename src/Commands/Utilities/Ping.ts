import {CommandInteraction, Client, SlashCommandBuilder, SlashCommandSubcommandBuilder} from "discord.js";
import {Executor, SubCommand} from "../../Handler/Command.ts";

export const Ping: SubCommand = {
    data: new SlashCommandSubcommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    execute : async (client: Client, interaction: CommandInteraction, executor?: Executor) => {
        const ping = Date.now() - interaction.createdTimestamp;
        const content = `Pong! Latency: ${ping}ms`;
        await interaction.reply({ content, ephemeral: true });
    }
};

