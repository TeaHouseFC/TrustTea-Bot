import { CommandInteraction, Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType} from "discord.js";
import {CommandsList} from "../Handler/Command.ts";

// Initialises the menu of commands to be displayed to user when right click or tapping on a user
// To perform context specific actions
// See https://discordjs.guide/interactions/context-menus.html#registering-context-menu-commands
const data = new ContextMenuCommandBuilder()
    .setName('User Information')
    .setType(ApplicationCommandType.User);


export default (client: Client): void => {
    client.on("interactionCreate", async (Interaction: Interaction) => {
        if (Interaction.isCommand() || Interaction.isUserContextMenuCommand()) {
            await HandleSlashCommand(client, Interaction);
        }
    });
};

const HandleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    let parentCommand = CommandsList.find(command => command.data.name === interaction.commandName);

    if (!parentCommand) {
        console.log("No Command was found");
        await interaction.reply({ content: "Command not found", ephemeral: true });
        return;
    }

    let subCommandName = interaction.options.data[0].name;
    let subCommand = parentCommand.subcommands.find(sub => sub.data.name === subCommandName);

    if (!subCommand) {
        console.log("No Subcommand was found");
        await interaction.reply({ content: "Subcommand not found", ephemeral: true });
        return;
    }

    // Get Id of person who executed the command and the guild
    // Placeholder for now
    let executor: {userId: string, guildId: string} = {userId: "0" , guildId: "0"};

    if (interaction.user.id && interaction.guildId) {
        executor = {userId: interaction.user.id, guildId: interaction.guildId};
    }

    // Execute the subcommand/
    subCommand.execute(client, interaction, executor);
};