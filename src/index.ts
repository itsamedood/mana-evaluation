import { GatewayIntentBits, Partials } from "discord.js";
import Bot from "./bot";

const client = new Bot({
  intents: [
		GatewayIntentBits.Guilds, // How the fuck did I not have this already...
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
});

(async (): Promise<void> => {
	await client.processEventSets();
	await client.registerEvents();
  await client.processSets();
  await client.registerCommands();
  await client.login(process.env["TOKEN"]); // This should be last!
})();
