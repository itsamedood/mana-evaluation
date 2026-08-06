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
		if (!message.guildId || !message.member?.id) return;

		const configData = client.dataMngr.cache.get(message.guildId);
		const memberId = message.member.id;

		if (!configData) return;

		if (!configData.awakenedUsers.has(memberId)) {
			if (client.slowed.includes(memberId)) {
				console.log(`${memberId} is in client.slowed!`);
				return;
			}

			if (client.rankMngr.rollAwakening(configData.awakenOdds)) {
				const newConfigData = client.rankMngr.awaken(memberId, configData);
				client.dataMngr.cache.set(message.guildId, newConfigData); // Update config data.

				if (message.channel.isSendable())
					await message.channel.send({ content: client.awakenMessage(memberId) });
			}

			client.slowed.push(memberId);
			console.log(`Added ${memberId} to client.slowed!`);
			setTimeout(() => client.removeUserFromSlowed(memberId), 3e3);
		}
  }
}

export default {
	name: new MessageCreateEvent(),
	buttons: [new AwakenButton()]
}
