import {
    CommandInteraction,
    Client,
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandSubcommandBuilder
} from "discord.js";
import {CheckCharacterCommands} from "../Commands/LodestoneCharacterInteractions/Index.ts";
import {BotUtilityCommands} from "../Commands/Utilities/Index.ts";
import {LodestoneFCUtilityCommands} from "../Commands/LodestoneFCUtilities/Index.ts";


export const CommandsList = [
    CheckCharacterCommands,
    BotUtilityCommands,
    LodestoneFCUtilityCommands
]
export interface CommandWithSubCommands {
    data: SlashCommandSubcommandsOnlyBuilder
    execute: (client: Client, interaction: CommandInteraction) => void;
}

export interface Executor {
    guildId: string;
    userId: string;
}

export interface PrimaryCommand {
    data: SlashCommandSubcommandsOnlyBuilder;
    subcommands: SubCommand[];
    executor?: Executor;
}

export interface SubCommand {
    data: SlashCommandSubcommandBuilder
    execute: (client: Client, interaction: CommandInteraction, executor?: Executor) => void;
}
