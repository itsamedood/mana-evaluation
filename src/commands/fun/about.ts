import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class AboutCommand extends Command {
	constructor() {
		super({
			data: {
				name: "about",
				description: "Tells you about me!"
			},
			category: "FUN"
		});
	}

	public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		// const latency = Date.now() - interaction.createdTimestamp
		// return await interaction.reply({ content: `# Pong!\n> :ping_pong: **Latency:** \`${latency}ms\`` });
	}
}

export default {
	command: new AboutCommand()
}
