import {
    CommandInteraction,
    Client,
     SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import {lodestoneCommand} from "../Commands/LodestoneInteractions/LodestoneCommands.ts";
import {Ping} from "../Commands/Utilities/Ping.ts";
import {ReloadCommands} from "../Commands/Utilities/ReloadCommands.ts";



export const CommandsList = [
    lodestoneCommand,
    Ping,
    ReloadCommands
]
export interface Command {
    data: SlashCommandSubcommandsOnlyBuilder
    execute: (client: Client, interaction: CommandInteraction) => void;
}