import { Ping } from "../Commands/Ping";
import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import {GetCharacterFreeCompany} from "../Commands/GetCharacterFreeCompany.ts";
import {GetCharacterId} from "../Commands/GetCharacterId.ts";
import {CheckCharacterFreeCompany} from "../Commands/CheckCharacterFreeCompany.ts";

// Typescript Interface for Commands Array
// Run is a function that takes the client and interaction as parameters
export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
}

//Commands Array: Add new commands by importing the command from the files in the commands folder then add to below array
export const Commands: Command[] = [Ping, GetCharacterFreeCompany, GetCharacterId, CheckCharacterFreeCompany];



