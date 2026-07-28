import type { Message } from "discord.js";
import Event from "../types/event";
import Bot from "../bot";

export default class MessageCreateEvent extends Event {
  constructor() { super({ name: "messageCreate" }); }

	private _rollForAwakening(): void {
		// const roll = Math.random() * 100; // 0 to 100
		// if (roll < awakenOdds) { }
	}

  public async execute(client: Bot, message: Message) {
    //
  }
}
