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
    const slashCommand = CommandsList.find(command => command.data.name === interaction.commandName);

    if (!slashCommand) {
        console.log("No Command was found");
        await interaction.reply({ content: "Command not found", ephemeral: true });
        return;
    }
    // await interaction.deferReply();
    slashCommand.execute(client, interaction);
};