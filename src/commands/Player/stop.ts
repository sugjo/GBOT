import { SlashCommandBuilder } from "discord.js";

import { player } from "@/entities/Player";
import { SlashCommandFile } from "@/shared/types";

export const stop = {
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Остановить плейер"),
	execute: (interaction) => {
		player.stopPlayer(interaction);
	}
} as SlashCommandFile;
