import {Client, REST, Routes} from "discord.js";
import {commands} from "../Handler/Command.ts";
const dotenv = require("dotenv").config();

export async function Startup(client : Client) {
    console.log("start refreshing application (/) commands.");
    let token = process.env.DISCORD_TOKEN;

    if (token === null || token === undefined) {
        throw Error("TOKEN and client environment variables are required.");
    } else {
        if (typeof token !== 'string') {
            throw Error("TOKEN needs to be of type string");
        } else {
            const rest = new REST({version: '10'}).setToken(token);
            let commandsList = commands.map(command => command.data);
            if (client.application === null || client.application === undefined) {
                throw Error("No Client Found");
            } else {
                try {
                    // Easy Way
                    // await client.application.commands.set(commandsList);
                    // Globally
                    await rest.put(Routes.applicationCommands("1271062992192147526"), {body: commandsList})
                    // Specific Guild
                    // await rest.put(Routes.applicationGuildCommands(process.env.DiscordClient, process.env.DiscordAdminGuild), {body: commandsList})

                } catch (err) {
                    let error = JSON.stringify(err, null, 2);
                    throw Error(error);
                }
            }

        }
    }

}

