import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command, { OptionType } from "../../types/command";

class RankCommand extends Command {
  constructor() {
    super({
      data: {
        name: "rank",
        description: "Play around with ranks.",
        options: [
          {
            name: "reroll",
            type: OptionType.SUB_COMMAND,
            description: "Rerolls a user's rank.",
						options: [
							{
								name: "user",
								description: "User to reroll the rank of.",
								type: OptionType.USER,
								required: true
							}
						]
          },
          {
            name: "set",
            type: OptionType.SUB_COMMAND,
            description: "Set a user's rank. Choose from E-NL.",
						options: [
							{
								name: "user",
								description: "User to set the rank of.",
								type: OptionType.USER,
								required: true
							}
						]
          },
					{
						name: "list",
						type: OptionType.SUB_COMMAND,
						description: "Lists the total of users per rank."
					}
        ]
      },
      category: "NL"
    });
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    const modifier = interaction.options.getSubcommand(true);
    const user = interaction.options.getUser("user", true);

    // await interaction.reply({ content: `Subcommand: **${modifier}**\nUser: <@${user.id}>` });
		switch (modifier) {
			case "reroll":
				// ...
				break;

			case "set":
				// ...
				break;

			case "list":
				// ...
				break;
		}
  }
}

export default {
  command: new RankCommand()
}
