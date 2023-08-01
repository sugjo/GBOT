import { APIInteractionGuildMember, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type SlashCommandFile = {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
	execute: (interaction: ChatInputCommandInteractionWithVoice) => void
}

export interface GuildMemberWithVoice extends APIInteractionGuildMember  {
	voice?: {
		channelId: string;
		disconnect: () => void;
	}
}

export interface ChatInputCommandInteractionWithVoice extends ChatInputCommandInteraction  {
	member: GuildMemberWithVoice | null;
}
