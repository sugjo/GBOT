import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { commandFiles } from "./commands";
import { ClientWithCommands } from "./types";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] }) as ClientWithCommands;

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();

for (const command of commandFiles) {
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
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
		} else {
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
});

client.login(process.env.DC_TOKEN);
