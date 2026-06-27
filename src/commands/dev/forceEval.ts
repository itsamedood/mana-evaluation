import { Message } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class ForceEvalCommand extends Command {
  constructor() {
    super({
      data: {
        name: "forceEval",
        description: "Forces an evaluation on the user."
      },
      category: "SETTINGS"
    });
  }

  public async execute(message: Message, client: Bot) {
    console.log(message.content);
  }
}

export default {
  command: new ForceEvalCommand()
}
