import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command, { OptionType } from "../../types/command";

class AwakenCommand extends Command {
	constructor() {
		super({
			data: {
				name: "awaken",
				description: "Force awaken a member.",
				options: [
					{
						name: "member",
						type: OptionType.USER,
						description: "Member to force awaken.",
						required: true
					}
				]
			},
			category: "NL"
		});
	}

	public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		const user = interaction.options.getUser("member", true);
		const member = await interaction.guild?.members.fetch({ user: user.id, force: true });
		if (!member || !interaction.guildId) return;

		const configData = client.dataMngr.cache.get(interaction.guildId);
		if (!configData) return await interaction.reply({ content: "No config data found.", flags: "Ephemeral" });

		const newConfigData = client.rankMngr.awaken(member.id, configData);
		client.dataMngr.cache.set(interaction.guildId, newConfigData);
	}
}

export default {
	name: new AwakenCommand()
}
