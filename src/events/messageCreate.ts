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

	private _rollForAwakening(awakenOdds: number): void {
		const roll = Math.random() * 100; // 0 to 100
		if (roll < awakenOdds) {
			//
		}
	}

  public async execute(client: Bot, message: Message) {
    if (message.member?.user.bot) return;
		if (!message.guild?.id || !message.member?.id) return;

		const configData = client.dataMngr.cache.get(message.guild.id);
		const memberId = message.member.id;

		if (!configData) return;

		if (!configData.awakenedUsers.has(memberId)) {
			if (client.slowed.includes(memberId)) return;

			const what = this._rollForAwakening(configData.awakenOdds);
			client.slowed.push(memberId);
		}
  }
}

export default {
	name: new MessageCreateEvent(),
	buttons: [new AwakenButton()]
}
