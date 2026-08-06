import { GatewayIntentBits, Partials } from "discord.js";
import Bot from "./bot";

const client = new Bot({
  intents: [
		GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls
  ],

  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
  ],
}, Bun.argv.includes("-debug"));

(async (): Promise<void> => {
	console.log(client.debug ? `🪲 Started in debug mode!` : `⚙️ Starting...`);
	await client.processEventSets();
	await client.registerEvents();
  await client.processSets();
  await client.registerCommands();
  await client.login(process.env["TOKEN"]); // This should be last!
})();
