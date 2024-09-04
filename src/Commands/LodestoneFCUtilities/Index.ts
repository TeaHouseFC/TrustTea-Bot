import {PrimaryCommand} from "../../Handler/Command.ts";
import {SlashCommandBuilder} from "discord.js";
import {RegisterFCMembers} from "./RegisterFCMembers.ts";


export const LodestoneFCUtilityCommands: PrimaryCommand = {
    data: new SlashCommandBuilder()
        .setName('lodestonefcutilities')
        .setDescription('Handles utilities regarding entire free company on the lodestone')
        .addSubcommand(RegisterFCMembers.data)
    ,
    subcommands: [RegisterFCMembers]
};