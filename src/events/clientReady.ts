import { ActivityType } from "discord.js";
import Event from "../types/event";
import Bot from "../bot";

class ClientReadyEvent extends Event {
  constructor() { super({ name: "clientReady", once: true }); }

  public async execute(client: Bot) {
    if (!client.user) return;

    client.user.setPresence({
      status: "idle",
      activities: [{
        name: "Waiting for someone to evaluate...",
        type: ActivityType.Custom,
        url: "https://itsamedood.github.io"
      }]
    });

    console.log(`🏁 Finished! Logged in as ${client.user.username}!`);
  }
}

export default {
	name: new ClientReadyEvent()
}
