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

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		let config_exists = false;
		interaction.guild?.channels.cache.forEach((c) => { config_exists = c.name == "mana-evaluator-config" });

		await interaction.reply({ content: `Config exists: ${config_exists}`, flags: "Ephemeral" });
	}
}

export default {
  command: new SetupCommand()
}
