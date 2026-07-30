import Event from "../types/event";
import Bot from "../bot";
import type { Guild } from "discord.js";

/**
 * Emitted when the bot joins a guild.
 */
class GuildCreateEvent extends Event {
	constructor() { super({ name: "guildCreate" }); }

	public async execute(client: Bot, guild: Guild) {
		client.dataMngr.createNewEntry(guild.id);
	}
}

export default {
	name: new GuildCreateEvent()
}
