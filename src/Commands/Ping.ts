import { CommandInteraction, Client} from "discord.js";
import {Command} from "../Handler/CommandList.ts";

// Example of a simple ping command
// Name of command must be lowercase
// name: command name to appear in discord
// description: description of the command to appear in discord
export const Ping: Command = {
    name: "ping",
    description: "Get the current ping of the bot",
    // run function to execute the command
    run: async (client: Client, interaction: CommandInteraction) => {
        const ping = Date.now() - interaction.createdTimestamp;
        const content = `Pong! Latency: ${ping}ms`;
        // interaction.followUp sends a message to the channel where the command was used
        // ephemeral: true makes the message visible only to the user who used the command
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};