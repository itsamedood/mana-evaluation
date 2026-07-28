import Event from "../types/event";
import Bot from "../bot";

/**
 * Emitted when the bot is removed from a guild.
 */
class GuildDeleteEvent extends Event {
	constructor() { super({ name: "guildDelete", once: true }); }

	public async execute(client: Bot) { }
}

export default {
	name: new GuildDeleteEvent()
}
