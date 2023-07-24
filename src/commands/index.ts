import { CommandFile } from "../types";
import { commandInit } from "../utils/commandInit";
import ping from "./ping";
import play from "./play";

export const commandFiles:CommandFile[] = [ping, play];

commandInit(commandFiles);
