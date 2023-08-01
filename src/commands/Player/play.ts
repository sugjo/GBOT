import { SlashCommandBuilder } from "discord.js";

import { player } from "@/entities/Player";
import { SlashCommandFile } from "@/shared/types";

export const play = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Запуск музыки по ссылке")
		.addStringOption(option => option.setName("url").setDescription("youtube url").setRequired(true)),
	execute: (interaction) => {
		const url = interaction.options.getString("url", true);

		player.addSong(interaction, url);
	}
} as SlashCommandFile;
