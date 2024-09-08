import {PrimaryCommand} from "../../Handler/Command.ts";
import {SlashCommandBuilder} from "discord.js";
import {GetCharacterFreeCompany} from "./GetCharacterFreeCompany.ts";
import {GetCharacterId} from "./GetCharacterId.ts";

export const CheckCharacterCommands: PrimaryCommand = {
    data: new SlashCommandBuilder()
        .setName('lodestone')
        .setDescription('Handles interactions using the lodestone')
        .addSubcommand(GetCharacterFreeCompany.data)
        .addSubcommand(GetCharacterId.data)
    ,
    subcommands: [GetCharacterFreeCompany, GetCharacterId]
};
