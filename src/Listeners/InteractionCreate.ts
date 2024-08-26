import { CommandInteraction, Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType} from "discord.js";
import {commands} from "../Handler/Command.ts";

// Initialises the menu of commands to be displayed to user when right click or tapping on a user
// To perform context specific actions
// See https://discordjs.guide/interactions/context-menus.html#registering-context-menu-commands
const data = new ContextMenuCommandBuilder()
    .setName('User Information')
    .setType(ApplicationCommandType.User);


// Event listener for the interactionCreate event
// Checks if the interaction is a command or UserContextMenuCommand
// If it is, passes it to the HandleSlashCommand function to process
export default (client: Client): void => {
    client.on("interactionCreate", async (Interaction: Interaction) => {
        if (Interaction.isCommand() || Interaction.isUserContextMenuCommand()) {
            await HandleSlashCommand(client, Interaction);
        }
    });
};

// Handles the slash command by clicking the Array of commands to find the command that matches the interaction
// Returns a message if the command is not found
const HandleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    let commandList = commands;
    // Match interaction command to commandList
    let slashCommand = commandList.find((command) => command.data.name === interaction.commandName);

    if (!slashCommand) {
        console.log("No Command was found")
        await interaction.reply({ content: "Command not found", ephemeral: true });
        return;
    }


    // await interaction.deferReply();

    slashCommand.run(client, interaction);
};