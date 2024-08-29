import {Client, REST, Routes} from "discord.js";
import {CommandsList} from "../Handler/Command.ts";


export interface ReloadResult {
    reloadSuccessful: boolean;
    error: string;
}


export async function ReloadGuildCommands(client: Client, guildId: string): Promise<ReloadResult> {

    let discordToken = process.env.DISCORD_TOKEN;
    let discordClient = process.env.DISCORD_CLIENT;

    if (discordToken === null || discordToken === undefined || discordClient === null || discordClient === undefined) {
        return {reloadSuccessful: false, error: "Unable to get Discord token or clientId which are required"};
    }

    if (client.application === null || client.application === undefined) {
        return {reloadSuccessful: false, error: "No Discord Client Found"};
    }

    try {
        const rest = new REST({version: '10'}).setToken(discordToken);

        // Clear existing commands
        const existingCommands: any[] = await rest.get(Routes.applicationCommands(discordClient)) as any[];
        await rest.put(Routes.applicationCommands(discordClient), {body: []});
        // Clear existing guild commands
        const existingGuildCommands: any[] = await rest.get(Routes.applicationGuildCommands(discordClient, guildId)) as any[];
        await rest.put(Routes.applicationGuildCommands(discordClient, guildId), {body: []});

        let commandsList = CommandsList.map(command => command.data);
        // Specific Guild
        await rest.put(Routes.applicationGuildCommands(discordClient, guildId), {body: commandsList})
        } catch (err) {
            let error = JSON.stringify(err, null, 2);
            return {reloadSuccessful: false, error: error};
        }
    return {reloadSuccessful: true, error: ""};
}