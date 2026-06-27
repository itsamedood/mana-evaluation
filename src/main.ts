import { GatewayIntentBits, Partials } from "discord.js";
import Bot from "./bot";

const client = new Bot({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],

  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
  ],
});

(async (): Promise<void> => {
  await client.processSets();
  await client.registerEvents();
  await client.registerCommands();
  await client.login(process.env["TOKEN"]); // This should be last!
})();
