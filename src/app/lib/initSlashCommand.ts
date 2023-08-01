import { Collection, Events } from "discord.js";

import { SlashCommands } from "@/commands";
import { ChatInputCommandInteractionWithVoice } from "@/shared/types";

import { ClientWithCommands } from "../types";

export function initSlashCommand(client: ClientWithCommands) {

	if (client?.commands) {
		console.log("[WARNING] commands not working.");
		return;
	}

	client.commands = new Collection();

	for (const command of SlashCommands) {
		if (command["data"] && command["execute"]) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${command.data.name} is missing a required "data" or "execute" property.`);
		}
	}

	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;

		const command = (interaction.client as ClientWithCommands).commands?.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			command.execute(interaction as ChatInputCommandInteractionWithVoice);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
			} else {
				await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
			}
		}
	});
}
