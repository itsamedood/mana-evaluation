import Event from "../types/event";
import Bot from "../bot";

export default class MessageCreateEvent extends Event {
  constructor() { super({ name: "messageCreate" }); }

  public async execute(client: Bot, message: string) {
    // if (!client.user) return;

    //
  }
}
