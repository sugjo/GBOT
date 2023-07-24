import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel,NoSubscriberBehavior } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import play from "play-dl";

import { ChatInputCommandInteractionWithVoice } from "../types";

export default {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Запуск музыки по ссылке")
		.addStringOption(option => option.setName("url").setDescription("youtube url").setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {

		const url = interaction.options.getString("url");

		if (!interaction.guild?.id || !interaction.channel?.id) {
			await interaction.reply("Войди в войс!");
			return;
		}

		if (!url) {
			await interaction.reply("Ссылку кинь придурок!");
			return;
		}

		const connection = joinVoiceChannel({
			channelId: (interaction.member as ChatInputCommandInteractionWithVoice).voice.channelId,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator
		});

		const stream = await play.stream(url);
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		if (!interaction.guildId) return;

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		player.play(resource);

		player.on(AudioPlayerStatus.Playing, () => {
			console.log("The audio player has started playing!");
		});

		player.on(AudioPlayerStatus.Idle, () => {
			console.log("idle");
		});

		connection.subscribe(player);

		await interaction.reply(`Я сказала стартуем! Стартуем. \n${url}`);
	}
};
