import { Message } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class RankCommand extends Command {
  constructor() {
    super({
      data: {
        name: "rank",
        description: "Play around with ranks."
      },
      category: "NL"
    });
  }

  public async execute(message: Message, client: Bot) {
    console.log(message.content);
  }
}

export default {
  command: new RankCommand()
}
