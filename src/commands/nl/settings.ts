import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class SettingsCommand extends Command {
  constructor() {
    super({
      data: {
        name: "settings",
        description: "Change bot settings."
      },
      category: "CONFIG"
    });
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) { }
}

export default {
  command: new SettingsCommand()
}
