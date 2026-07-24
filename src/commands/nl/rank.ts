import { ChatInputCommandInteraction, GuildMember, Role, type APIRole } from "discord.js";
import Bot from "../../bot";
import Command, { OptionType } from "../../types/command";

class RankCommand extends Command {
	private _roleNames = ["E-Rank", "D-Rank", "C-Rank", "B-Rank", "A-Rank", "S-Rank", "National Level"];

	// These numbers will be tweakable!
	// private _weightedRanks= [
	// 	...Array(40).fill("E-Rank"),
	// 	...Array(25).fill("D-Rank"),
	// 	...Array(15).fill("C-Rank"),
	// 	...Array(10).fill("B-Rank"),
	// 	...Array(6).fill("A-Rank"),
	// 	...Array(3).fill("S-Rank"),
	// 	...Array(1).fill("National Level"),
	// ]

	// These numbers will be tweakable!
	private _rankChances: { name: string; chance: number }[] = [
		{ name: "National Level", chance: 0.5 },
		{ name: "S-Rank", 				chance: 2.5 },
		{ name: "A-Rank", 				chance: 7.0},
		{ name: "B-Rank", 				chance: 12.0 },
		{ name: "C-Rank", 				chance: 18.0 },
		{ name: "D-Rank", 				chance: 25.0 },
		{ name: "E-Rank", 				chance: 35.0 },
	]

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

	private async _getRandomRank(): Promise<string> {
		const roll = Math.random() * 100; // 0-100.
		let accumulated = 0;

		for (const rank of this._rankChances) {
			accumulated += rank.chance;
			if (roll <= accumulated) return rank.name;
		}

		return "E-Rank"; // Fallback.
	}

	/**
	 * Goes through each of the members roles, checking if it is a rank.
	 * @param member The member to check.
	 * @returns A `Role` (which is their rank), or `undefined` if they're unranked.
	 */
	private _checkForExistingRank(member: GuildMember): Role | undefined {
		return member.roles.cache.find(r => this._roleNames.includes(r?.name));
	}

	private async _setRank(member: GuildMember, role: Role | APIRole): Promise<void> {
		const currentRank = this._checkForExistingRank(member);

		if (currentRank) await member?.roles.remove(currentRank.id);
		await member?.roles.add(role.id);
	}

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    const modifier = interaction.options.getSubcommand(true);

		switch (modifier) {
			case "reroll": {
				const user = interaction.options.getUser("user", true);

				// Fetch odds from settings in config channel...
				const member = await interaction.guild?.members.fetch({ user: user.id, force: true });
				if (!member) return;

				const chosen = await this._getRandomRank();
				const ogRank = this._checkForExistingRank(member);
				const roles = await interaction.guild?.roles.fetch();
				const cRole = await roles?.find(r => r.name == chosen);

				if (!cRole) return;
				if (!member?.roles.cache.has(cRole.id))
					this._setRank(member, cRole);

				return await interaction.reply({ content: `Rerolled <@${user.id}>'s rank!\n<@&${ogRank?.id}> => <@&${cRole.id}>` });
				break; // Redundant.
			}

			case "set": {
				const user = interaction.options.getUser("user", true);
				const role = interaction.options.getRole("rank", true);

				if (this._roleNames.includes(role.name)) {
					await interaction.guild?.roles.fetch(); // Fetch this shit so shit stops blowing up. Frickin' Discord (&/| DJS).

					const member = await interaction.guild?.members.fetch({ user: user.id, force: true });
					if (!member) return;
					this._setRank(member, role);

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
