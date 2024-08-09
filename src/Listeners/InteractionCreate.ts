import { CommandInteraction, Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType} from "discord.js";
import { Commands } from "../Handler/CommandList";

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
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        // What to display to the user if the slash command isn't recognised/found
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};