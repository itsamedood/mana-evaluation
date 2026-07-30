import Event from "../types/event";
import Bot from "../bot";
import type { Guild } from "discord.js";

/**
 * Emitted when the bot is removed from a guild.
 */
class GuildDeleteEvent extends Event {
	constructor() { super({ name: "guildDelete" }); }

	public async execute(client: Bot, guild: Guild) {
		client.dataMngr.removeEntry(guild.id);
	}
}

export default {
	name: new GuildDeleteEvent()
}
