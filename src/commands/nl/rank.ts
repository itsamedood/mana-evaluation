import { ChatInputCommandInteraction, GuildMember, Role } from "discord.js";
import Bot from "../../bot";
import Command, { OptionType } from "../../types/command";

class RankCommand extends Command {
	private _roleNames = ["E-Rank", "D-Rank", "C-Rank", "B-Rank", "A-Rank", "S-Rank", "National Level"];

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
					},
					{
						name: "odds",
						type: OptionType.SUB_COMMAND,
						description: "Set the odds of the rank.",
						options: [
							{
								name: "rank",
								type: OptionType.ROLE,
								description: "The rank to modify the odds of.",
								required: true
							},
							{
								name: "chance",
								type:  OptionType.NUMBER,
								description: "%-Odds for the rank. >0 & <=100.",
								required: true
							}
						]
					}
        ]
      },
      category: "NL"
    });
  }

	/**
	 * Goes through each of the members roles, checking if it is a rank.
	 * @param member The member to check.
	 * @returns The role (which is their rank).
	 */
	private _checkForExistingRank(member: GuildMember): Role | undefined {
		return member.roles.cache.find(r => this._roleNames.includes(r?.name));
	}

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    const modifier = interaction.options.getSubcommand(true);

		switch (modifier) {
			case "reroll": {
				const user = interaction.options.getUser("user", true);
				return await interaction.reply({ content: `User: <@${user.id}>\nTo reroll!` });
				break; // Redundant.
			}

			case "set": {
				const user = interaction.options.getUser("user", true);
				const role = interaction.options.getRole("rank", true);

				if (this._roleNames.includes(role.name)) {
					await interaction.guild?.roles.fetch(); // Fetch this shit so shit stops blowing up. Frickin' Discord (&/| DJS).
					// const actualRole = interaction.guild?.roles.cache.find(r => r?.name == role.name);
					// if (!actualRole) return;

					const member = await interaction.guild?.members.fetch({ user: user.id, force: true });
					if (!member) return;
					const currentRank = this._checkForExistingRank(member);

					if (currentRank) await member?.roles.remove(currentRank.id);
					await member?.roles.add(role.id);

					return await interaction.reply({ content: `Assigned <@${user.id}> <@&${role.id}>.`, flags: "Ephemeral" });
				} else
					return await interaction.reply({ content: `Cannot assign <@&${role.id}> to <@${user.id}>.`, flags: "Ephemeral" });
				break; // Redundant.
			}

			case "odds": {
				const role = interaction.options.getRole("rank", true);
				const chance = interaction.options.getNumber("chance", true);

				return await interaction.reply({ content: `Role: <@&${role.id}>\nChance: **${chance}%**`, flags: "Ephemeral" });
				break; // Redundant.
			}

			case "list":
				return await interaction.reply({ content: "List deez nutz.", flags: "Ephemeral" });
				break; // Redundant.
		}
  }
}

export default {
  command: new RankCommand()
}
