import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior } from "@discordjs/voice";
import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import play from "play-dl";

import { ChatInputCommandInteractionWithVoice } from "@/shared/types";

export class Player {
	#interaction: ChatInputCommandInteractionWithVoice | undefined;
	#player: AudioPlayer;

	musicQueue: string[] = [];
	isLoop: boolean = false;

	constructor() {
		this.#player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		this.#player.on(AudioPlayerStatus.Idle, () => {
			console.log("[PLAYER_IDLE]", new Date().toLocaleTimeString());

			if (!this.#interaction?.guild?.id) return;

			if (!this.isLoop) {
				this.musicQueue.shift();
			}

			if (this.musicQueue.length <= 0) {
				getVoiceConnection(this.#interaction?.guild?.id)?.disconnect();
				return;
			}

			this.#say(`**А следующая песня ( •̀ ω •́ )✧** \n*[${this.musicQueue.length} в очереди]* \n${this.musicQueue[0]}`);
			this.playSong(this.musicQueue[0]);
		});
	}

	addSong(interaction: ChatInputCommandInteractionWithVoice, query: string) {
		if (!interaction.member?.voice?.channelId) {
			interaction.reply("**Зайди в войс, пожалуйста ^_^**");
			return;
		}

		this.#interaction = interaction;

		this.#joinToVoice(this.#interaction);

		switch (play.yt_validate(query)) {
		case "video": this.#startSong(interaction, query); break;
		case "search": this.#startSongByQuery(interaction, query); break;
		case "playlist": this.#startPlaylist(interaction, query); break;
		}

		console.log("[SONG_ADDED]", new Date().toLocaleTimeString(), query);
	}

	#startSong(interaction: ChatInputCommandInteractionWithVoice, query: string) {
		if (this.musicQueue.length <= 0) {
			this.musicQueue.push(query);
			this.playSong(query);
			interaction.reply(`**Поехали (～￣▽￣)～** \n${query}`);
		} else {
			this.musicQueue.push(query);
			interaction.reply(`**Я сыграю эту песню ${this.musicQueue.length} по счёту UwU** \n${query}`);
		}
	}

	async #startSongByQuery(interaction: ChatInputCommandInteractionWithVoice, query: string) {
		const video = await play.search(query, {source: {youtube: "video" }});
		if (!video) return;
		this.#say(`*Найдено по запросу: ${query}*`);
		this.#startSong(interaction, video[0].url);
	}

	async #startPlaylist(interaction: ChatInputCommandInteractionWithVoice, query: string) {
		const playlist = await play.playlist_info(query);
		const playlistUrls = (await playlist.all_videos()).map(video => video.url);

		if (this.musicQueue.length <= 0) {
			this.musicQueue = playlistUrls;

			this.playSong(this.musicQueue[0]);
		} else {
			this.musicQueue = [...this.musicQueue, ...playlistUrls];
		}

		interaction.reply(`**OwO ${playlistUrls.length} треков добавлено к очереди!** \n*[в очереди ${this.musicQueue.length}]* \n${query}`);
	}

	async playSong(url: string) {
		const stream = await play.stream(url);
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		this.#player.play(resource);

		console.log("[SONG_STARTED]", new Date().toLocaleTimeString(), url);
	}

	async skipSong(interaction: ChatInputCommandInteraction) {
		this.#player.stop();

		const songName = (await play.video_info(this.musicQueue[0])).video_details.title;

		interaction.reply(`**Пропускаю...** \n*[${songName}]* \n`);

		console.log("[SONG_SKIPPED]", new Date().toLocaleTimeString());
	}

	stopPlayer(interaction: ChatInputCommandInteraction) {
		this.musicQueue.length = 0;
		this.#player.stop();

		interaction.reply("**На этом всё (*^_^*)**");

		console.log("[PLAYER_STOPPED]", new Date().toLocaleTimeString());
	}

	#joinToVoice(interaction: ChatInputCommandInteractionWithVoice) {
		if (!interaction.guild?.id || !interaction.member?.voice?.channelId) {
			interaction.reply("**Ты откуда это сказал?**");
			return;
		}

		const connection = joinVoiceChannel({
			channelId: interaction.member?.voice?.channelId,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator
		});

		console.log("[BOT_JOIN_TO_VOICE]", new Date().toLocaleTimeString());

		connection.subscribe(this.#player);
	}

	#say(msg: string) {
		if (this.#interaction?.channel) {
			(this.#interaction.client.channels.cache.get(this.#interaction.channel.id) as TextChannel).send(msg);
		}
	}
}

export const player = new Player();
