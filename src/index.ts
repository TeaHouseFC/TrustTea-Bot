import InteractionCreate from "./Listeners/InteractionCreate.ts";

const dotenv = require("dotenv").config();
import {Client, Events, GatewayIntentBits} from "discord.js";
import {Startup} from "./Listeners/Startup.ts";
import { PrismaClient} from "@prisma/client";
import GuildMemberUpdate from "./Listeners/GuildMemberUpdate.ts";

const requiredEnvs = [
    'DISCORD_TOKEN',
    'DATABASE_URL',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME'
]

async function InitialiseBot() {
    // Create and connect Prisma database instance
    const prisma = new PrismaClient();
    let retries = 3;
    while (retries > 0) {
        try {
            await prisma.$connect();
            console.log("Connected to database");
            break;
        } catch (err) {
            console.log("Error connecting to database: ", err);
            retries--;
            console.log(`Retries left: ${retries}`);
            console.log("Retrying in 10 seconds...");
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }

    if (retries === 0) {
        throw new Error("Failed to connect to the database after 3 attempts");
    }

    try {
        // Create a new Discord Client with the required intents
        const client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences]
        });

        // Once everything is loaded, attempt to login to Discord with provided token and complete startup actions
        await client.login(process.env.DISCORD_TOKEN);
        Startup(client);
        InteractionCreate(client);
        GuildMemberUpdate(client);

        // Once the client "Discord Bot" is ready to receive commands, log the bot's tag to the console
        client.once(Events.ClientReady, readyClient => {
            console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        });
    } catch (err) {
        console.log("Error Starting Bot: ", err);
    }
}

InitialiseBot();



