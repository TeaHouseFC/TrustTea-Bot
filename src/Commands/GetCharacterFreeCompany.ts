import {CommandInteraction, Client, ApplicationCommandOptionType} from "discord.js";
import {Command} from "../Handler/CommandList.ts";
import {GetLodestoneFreeCompany} from "../Helpers/LodestoneHelpers.ts";

export const GetCharacterFreeCompany: Command = {
    name: "getcharacterfreecompany",
    description: "Primitively searches the Lodestone for a character and returns their character FC",
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

        let content;
        try {
            let [firstName, lastName] = messageContent.split(" ");

            if (!firstName && lastName) {
                content = "Unable to get entered FirstName and LastName";
            } else {
                let freeCompany = await GetLodestoneFreeCompany(firstName, lastName);
                if (freeCompany) {
                    content = freeCompany;
                } else {
                    content = "Unable to get Free Company";
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