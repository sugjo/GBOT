import { SlashCommandFile } from "@/shared/types";

import { musicCommands } from "./Player";

export const SlashCommands: SlashCommandFile[] = [
	...musicCommands
];
