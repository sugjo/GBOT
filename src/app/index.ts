import "module-alias/register";

import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { SlashCommands } from "@/commands";

import { initSlashCommand } from "./lib/initSlashCommand";
import { reloadSlashCommand } from "./lib/reloadSlashCommand";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

initSlashCommand(client);
reloadSlashCommand(SlashCommands);

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.DC_TOKEN);
