import {Client, REST} from "discord.js";
import {CommandsList} from "../Handler/Command.ts";
const dotenv = require("dotenv").config();

//TODO Tidy
export async function Startup(client : Client) {
    console.log("start refreshing application (/) commands.");
    let token = process.env.DISCORD_TOKEN;

    if (token === null || token === undefined) {
        throw Error("TOKEN and client environment variables are required.");
    }
    if (client.application === null || client.application === undefined) {
        throw Error("No Client Found");
    }

    const rest = new REST({version: '10'}).setToken(token);
    let commandsList = CommandsList.map(command => command.data);

    if (client.user) {
        client.user.setActivity(`with ${client.guilds.cache.size} guild(s)`);
    }

    try {
        await client.application.commands.set(commandsList);
    } catch (err) {
        let error = JSON.stringify(err, null, 2);
        throw Error(error);
    }
}



