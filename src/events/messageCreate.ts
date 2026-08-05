import type { ButtonInteraction, Message } from "discord.js";
import Event from "../types/event";
import Bot from "../bot";
import Button from "../types/button";

class AwakenButton extends Button {
	constructor() { super({ customId: "awaken" }); }

	public async execute(interaction: ButtonInteraction, client: Bot) {
		//
	}
}

class MessageCreateEvent extends Event {
  constructor() { super({ name: "messageCreate" }); }

  public async execute(client: Bot, message: Message) {
    if (message.member?.user.bot) return;
		if (!message.guild?.id || !message.member?.id) return;

		const configData = client.dataMngr.cache.get(message.guild.id);
		const memberId = message.member.id;

		if (!configData) return;

		if (!configData.awakenedUsers.has(memberId)) {
			if (client.slowed.includes(memberId)) return;

			if (client.rankMngr.rollAwakening(configData.awakenOdds)) {
				const mana = client.rankMngr.rollMana(configData.manaRange.min, configData.manaRange.max);
				configData.awakenedUsers.set(memberId, mana); // Add the user and their mana to the awakened map.
				configData.modified = true;

				client.dataMngr.cache.set(message.guild.id, configData); // Update config data.
			}

			client.slowed.push(memberId);
		}
  }
}

export default {
	name: new MessageCreateEvent(),
	buttons: [new AwakenButton()]
}
