import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Тест бота"),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply("Pong!");
	}
};
