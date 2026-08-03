import { ChatInputCommandInteraction } from "discord.js";
import Command, { OptionType } from "../../types/command";
import Bot from "../../bot";

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
							},
							{
								name: "rank",
								description: "The rank to assign.",
								type: OptionType.ROLE,
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
		const roles = await interaction.guild?.roles.fetch();

		switch (modifier) {
			case "reroll": {
				// const user = interaction.options.getUser("user", true);

				// // Fetch odds from settings in config channel...
				// const member = await interaction.guild?.members.fetch({ user: user.id, force: true });
				// if (!member) return;

				// const ogRank = client.rankMngr.checkForExistingRank(member);
				// let cRole = roles?.find(r => r.name == chosen);

				// if (!cRole) cRole = roles?.find(r => r.name == "E-Rank")!;
				// if (!member?.roles.cache.has(cRole.id))
				// 	await this._setRank(member, cRole);

				// return await interaction.reply({ content: `Rerolled <@${user.id}>'s rank!\n<@&${ogRank?.id}> => <@&${cRole.id}>` });
				return await interaction.reply({ content: "...", flags: "Ephemeral" });
			}

			case "set": {
				const user = interaction.options.getUser("user", true);
				const role = interaction.options.getRole("rank", true);
				const member = await interaction.guild?.members.fetch({ user: user.id, force: true });
				if (!member) return;

				const success = await client.rankMngr.forceSetRank(member, role);
				const message = success ? `Assigned <@${user.id}> <@&${role.id}>.` : `Cannot assign <@&${role.id}> to <@${user.id}>.`;

				return await interaction.reply({ content: message, flags: "Ephemeral" });
			}

			case "list":
				return await interaction.reply({ content: "List deez nutz.", flags: "Ephemeral" });
		}
  }
}

export default {
  name: new RankCommand()
}
