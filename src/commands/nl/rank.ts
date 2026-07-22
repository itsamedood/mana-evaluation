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
          },
          {
            name: "set",
            type: OptionType.SUB_COMMAND,
            description: "Set a user's rank.",
          },
          {
            name: "user",
            type: OptionType.USER,
            description: "The user whose rank you'd like to modify.",
            required: true
          }
        ]
      },
      category: "NL"
    });
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) { }
}

export default {
  command: new RankCommand()
}
