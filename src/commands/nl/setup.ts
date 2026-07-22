import { ChatInputCommandInteraction } from "discord.js";
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

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) { }
}

export default {
  command: new SetupCommand()
}
