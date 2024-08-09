import { Client } from "discord.js";
import { Commands } from "../Handler/CommandList";


// Event Listener for the ready event
// Triggered when the bot has successfully logged in and is ready to receive commands
// Kind of Redundant as we have a listener in the index.ts file
// But can be used to set the bot's activity status or further initialisation or separate logic later on if needed
export default (client: Client): void => {

    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        // Registers the commands found in the Commands Array in the CommandList.ts file with discord API
        // This is what allows the /command prompt to appear as the commands are registered with discord.
        await client.application.commands.set(Commands);

        // Set the bot's activity status to "Playing with x guilds" where x is the number of guilds the bot is
        // Guilds are discord's term for server
        client.user.setActivity(`with ${client.guilds.cache.size} guild(s)`);
        console.log(`${client.user.username} is online`);
    });
};