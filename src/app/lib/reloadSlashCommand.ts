import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import dotenv from "dotenv";

import { SlashCommandFile } from "@/shared/types";

export async function reloadSlashCommand(commandFiles: SlashCommandFile[]) {
	dotenv.config();

	if (!process.env.DC_TOKEN) {
		throw "Token is empty";
	}

	const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
	const rest = new REST().setToken(process.env.DC_TOKEN);

	try {
		console.log(`Started refreshing ${commandFiles.length} application (/) commands.`);

		if (!process.env.DC_CLIENT_ID) {
			throw "ClientId is empty";
		}

		for (const command of commandFiles) {
			if (command["data"] && command["execute"]) {
				commands.push(command.data.toJSON());
			} else {
				console.log(`[WARNING] The command at ${command.data.name} is missing a required "data" or "execute" property.`);
			}
		}

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.DC_CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${(data as {length: number}).length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}
