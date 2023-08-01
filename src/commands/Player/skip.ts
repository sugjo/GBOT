import { SlashCommandBuilder } from "discord.js";

import { player } from "@/entities/Player";
import { SlashCommandFile } from "@/shared/types";


export const skip = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Пропустить текущую песню"),
	execute: (interaction) => {
		player.skipSong(interaction);
	}
} as SlashCommandFile;
