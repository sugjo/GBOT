import { Client, Collection } from "discord.js";

import { SlashCommandFile } from "@/shared/types";

export class ClientWithCommands extends Client {
	commands?: Collection<string, SlashCommandFile>;
}
