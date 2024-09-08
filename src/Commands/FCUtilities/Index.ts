import {PrimaryCommand} from "../../Handler/Command.ts";
import {SlashCommandBuilder} from "discord.js";
import {RegisterFCMembers} from "./RegisterFCMembers.ts";
import {RegisterFCGuild} from "./RegisterFCGuild.ts";


export const FCUtilityCommands: PrimaryCommand = {
    data: new SlashCommandBuilder()
        .setName('fcutilities')
        .setDescription('Handles utilities regarding entire free company on the lodestone')
        .addSubcommand(RegisterFCMembers.data)
        .addSubcommand(RegisterFCGuild.data)
    ,
    subcommands: [RegisterFCMembers, RegisterFCGuild]
};