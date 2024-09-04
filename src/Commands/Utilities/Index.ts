import {PrimaryCommand} from "../../Handler/Command.ts";
import {SlashCommandBuilder} from "discord.js";
import {ReloadCommands} from "./ReloadCommands.ts";
import {Ping} from "./Ping.ts";

export const BotUtilityCommands: PrimaryCommand = {
    data: new SlashCommandBuilder()
        .setName('botutilities')
        .setDescription('Handles utilities within the bot')
        .addSubcommand(Ping.data)
        .addSubcommand(ReloadCommands.data)
    ,
    subcommands: [Ping, ReloadCommands]
};