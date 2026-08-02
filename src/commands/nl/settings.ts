import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command, { OptionType } from "../../types/command";

class SettingsCommand extends Command {
  constructor() {
    super({
      data: {
        name: "settings",
        description: "Change bot settings.",
				options: [
					{
						name: "awakenodds",
						type: OptionType.SUB_COMMAND,
						description: "Set the odds for awakening.",
						options: [
							{
								name: "value",
								type: OptionType.NUMBER,
								description: "% for awakening.",
								required: true
							}
						]
					},
					{
						name: "maxnationallevels",
						type: OptionType.SUB_COMMAND,
						description: "Set the max amount of National Levels.",
						options: [
							{
								name: "value",
								type: OptionType.NUMBER,
								description: "-1 for none, 0 for infinite.",
								required: true
							}
						]
					}
				]
      },
      category: "NL"
    });
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		const subcmd = interaction.options.getSubcommand(true);

		switch (subcmd) {
			case "awakenodds": {
				const value = interaction.options.getNumber("value", true);

				await interaction.reply({ content: `Value: ${value}%` });
				break;
			}

			case "maxnationallevels": {
				const value = interaction.options.getNumber("value", true);

				await interaction.reply({ content: `Value: ${value} max N.L.s` });
				break;
			}
		}
	}
}

export default {
  name: new SettingsCommand()
}
