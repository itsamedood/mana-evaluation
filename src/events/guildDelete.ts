import { type ClientEvents } from "discord.js";
import Event from "../types/event";
import Bot from "../bot";

/**
 * Emitted when the bot is removed from a guild.
 */
export default class GuildDeleteEvent extends Event {
	constructor() { super({ name: "guildDelete", once: true }); }

	public async execute(client: Bot) { }
}
