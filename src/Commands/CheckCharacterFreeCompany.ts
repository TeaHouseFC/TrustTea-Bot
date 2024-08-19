import {Command} from "../Handler/CommandList.ts";
import {ApplicationCommandOptionType, Client, CommandInteraction} from "discord.js";
import {GetLodestoneFreeCompany, RobustlyCheckLodestoneFreeCompany} from "../Helpers/LodestoneHelpers.ts";

export const CheckCharacterFreeCompany: Command = {
    name: "checkcharacterfreecompany",
    description: "Robustly searches the Lodestone and returns the Free Company of a character using their in-game first and last name",
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

        let content = "";
        try {
            let [firstName, lastName] = messageContent.split(" ");

            if (!firstName && lastName) {
                content = "Unable to get entered FirstName and LastName";
            } else {
                let freeCompany = await RobustlyCheckLodestoneFreeCompany(firstName, lastName);
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