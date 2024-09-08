
import {Client, GuildMember, PartialGuildMember} from "discord.js";

// WIP
export default (client: Client): void => {
    client.on("guildMemberUpdate", async (oldGuildMember: GuildMember | PartialGuildMember, newGuildMember: GuildMember) => {

        if (oldGuildMember.nickname && newGuildMember.nickname) {
            if (oldGuildMember.nickname === newGuildMember.nickname) {
                // Return Do Nothing
            } else {

            }
        }

        console.log("DNS");
    });
}