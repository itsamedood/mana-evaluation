import { ActivityType } from "discord.js";
import Event from "../types/event";
import Bot from "../bot";

class ClientReadyEvent extends Event {
  constructor() { super({ name: "clientReady", once: true }); }

  public async execute(client: Bot) {
    const entries = await client.dataMngr.fetchAllEntries();
		const guilds = await client.guilds.fetch();

    client.user?.setPresence({
      status: "idle",
      activities: [{
        name: "Waiting for someone to evaluate...",
        type: ActivityType.Custom,
        url: "https://itsamedood.github.io"
      }]
    });

		console.log(`🔍 Checking that all guilds have an entry...`);
		await client.ensureAllGuildsHaveAnEntry();
		console.log(`👍 Done checking!`);

		console.log(`📂 Validating entries...`);
		await client.dataMngr.validateEntries([...guilds.keys()], entries);
		console.log(`📁 Done validating!`);

		console.log(`🗃️ Caching entries...`);
		await client.dataMngr.cache.cacheAllEntries(entries);
		console.log(`🗳️ Cached entries!`);

    console.log(`${client.debug ? '🪲' : '🏁'} Finished! Logged in as ${client.user?.username}!`);
  }
}

export default {
	name: new ClientReadyEvent()
}
