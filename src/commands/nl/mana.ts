import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command, { OptionType } from "../../types/command";

class ManaCommand extends Command {
	constructor() {
		super({
			data: {
				name: "mana",
				description: "Tweak the mana in the server.",
				options: [
					{
						name: "set",
						type: OptionType.SUB_COMMAND,
						description: "Set a members mana.",
						options: []
					},
					{
						name: "reroll",
						type: OptionType.SUB_COMMAND,
						description: "Reroll a members mana.",
						options: []
					}
				]
			},
			category: "NL"
		});
	}

	public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		await interaction.reply({ content: "To be implemented..." });
	}
}

export default {
	name: new ManaCommand()
}
