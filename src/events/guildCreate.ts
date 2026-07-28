import { type ClientEvents } from "discord.js";
import Event from "../types/event";
import Bot from "../bot";

/**
 * Emitted when the bot joins a guild.
 */
export default class GuildCreateEvent extends Event {
	constructor() { super({ name: "guildCreate", once: true }); }

	public async execute(client: Bot) { }
}
