import {
    CommandInteraction,
    ChatInputApplicationCommandData,
    Client,
    SlashCommandBuilder,
    PermissionResolvable
} from "discord.js";
import banCommand from "../Commands/Utilities/BasicPing.ts";


export const commands = [
    banCommand
]