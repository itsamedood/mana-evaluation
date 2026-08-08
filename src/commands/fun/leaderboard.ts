import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class LeaderboardCommand extends Command {
	constructor() {
		super({
			data: {
				name: "leaderboard",
				description: "Shows the leaderboard by mana!"
			},
			category: "FUN"
		});
	}

	public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		await interaction.reply({ content: "To be implemented..." });
	}
}

export default {
	name: new LeaderboardCommand()
}
