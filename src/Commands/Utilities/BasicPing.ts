import {Client, CommandInteraction, SlashCommandBuilder} from "discord.js";

// @ts-ignore
export const banCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the guild')
        .addSubcommand(subcommand =>
            subcommand
                .setName('temp')
                .setDescription('Temporarily ban a user from the guild')
                .addUserOption(option =>
                    option.setName('user').setDescription('The user to ban').setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('perm')
                .setDescription('Permanently ban a user from the guild')
                .addUserOption(option =>
                    option.setName('user').setDescription('The user to ban').setRequired(true)
                )
        ),
    run: async (client: Client, interaction: CommandInteraction) => {
        const user = "Base Option"
        if (!user) {
            await interaction.reply({ content: 'User not found', ephemeral: true });
            return;
        }
        await interaction.reply({ content: `Banned ${user}`, ephemeral: true });
    }
};

export default banCommand;