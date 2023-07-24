import { APIInteractionGuildMember, ChatInputCommandInteraction, Client, Collection, SlashCommandBuilder } from "discord.js";

export type CommandFile = {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export class ClientWithCommands extends Client {
	commands: Collection<string, CommandFile> | undefined;
}

export interface ChatInputCommandInteractionWithVoice extends APIInteractionGuildMember {
	voice: { channelId: string }
}
