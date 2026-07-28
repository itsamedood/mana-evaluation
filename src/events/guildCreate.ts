import Event from "../types/event";
import Bot from "../bot";

/**
 * Emitted when the bot joins a guild.
 */
class GuildCreateEvent extends Event {
	constructor() { super({ name: "guildCreate", once: true }); }

	public async execute(client: Bot) { }
}

export default {
	name: new GuildCreateEvent()
}
