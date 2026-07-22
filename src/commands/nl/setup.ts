import { Message } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class SetupCommand extends Command {
  constructor() {
    super({
      data: {
        name: "setup",
        description: "Setup the settings and rank channel."
      },
      category: "NL"
    });
  }

  public async execute(message: Message, client: Bot) {
    console.log(message.content);
  }
}

export default {
  command: new SetupCommand()
}
