import InteractionCreate from "./Listeners/InteractionCreate.ts";

const dotenv = require("dotenv").config();
import {Client, ClientOptions, Events, GatewayIntentBits} from "discord.js";
import { APIUser} from 'discord-api-types/v10';
import {Startup} from "./Listeners/Startup.ts";


// Loads the DISCORD_TOKEN from a .env file located in the root project directory outside /src
const discordToken = process.env.DISCORD_TOKEN;

if (discordToken === undefined || null) {
    console.log("DISCORD_TOKEN is not defined in the .env file or .env file not found");
    process.exit(1);
} else {
    try {
        // Create a new client instance
        // Intents are the way to specify which events the bot has access to from discord API
        // Minimising intents reduces the amount of data the bot receives which improves performance
        // And reduces the risk of hitting the rate limit
        const client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences]
        });

        // Once everything is loaded, attempt to login to Discord with provided token and complete startup actions
        client.login(discordToken).then(() => {
            Startup(client);
            InteractionCreate(client);
        });

        // Once the client "Discord Bot" is ready to receive commands, log the bot's tag to the console
        client.once(Events.ClientReady, readyClient => {

            console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        });
    } catch (err) {
        console.log("Error Starting Bot: ",err);
    }
}








