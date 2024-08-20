import {CommandInteraction, Client, ApplicationCommandOptionType} from "discord.js";
import {Command} from "../Handler/CommandList.ts";
import {GetLodestoneCharacterId} from "../Helpers/LodestoneHelpers.ts";

export const GetCharacterId: Command = {
    name: "getcharacterid",
    description: "Primitively searches the Lodestone for a character and returns the character Id",
    options: [
        {
            name: "message",
            description: "Player in-game Username",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    // run function to execute the command
    run: async (client: Client, interaction: CommandInteraction) => {
        let messageContent = interaction.options.get("message")!.value as string;

        // Default to Carbuncle Server as we only need to query the FCs server location
        let server = "Carbuncle";
        let content;
        try {
            let [firstName, lastName] = messageContent.split(" ");

            if (!firstName && lastName) {
                content = "Unable to get entered FirstName and LastName";
            } else {
                let characterId = await GetLodestoneCharacterId(firstName, lastName);
                if (characterId) {
                    content = characterId;
                } else {
                    content = "Unable to get Character Id";
                }
            }
        } catch (err) {
            console.error("Error:", err);
            content = `Error: ${err}`;
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};