import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class SetupCommand extends Command {
  constructor() {
    super({
      data: {
        name: "setup",
        description: "Setup the settings and rank channel."
      },
      category: "NL"
    });
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		const channels = await interaction.guild?.channels.fetch();
		const roles = await interaction.guild?.roles.fetch();

		// Check for config channel.
		let config_exists = false;
		channels?.find(c => c?.name == "mana-evaluator-config");
		// interaction.guild?.channels.cache.forEach((c) => { config_exists = c.name == "mana-evaluator-config" });

		// Check for rank roles.
		let e = false;
		let d = false;
		let c = false;
		let b = false;
		let a = false;
		let s = false;
		let n = false; // n = National Level.

		roles?.forEach((r) => {
			let rank = r.name.charAt(0);
			let endsWithDashRank = r.name.endsWith("-Rank");
			// console.log(r.name, endsWithDashRank);

			if (endsWithDashRank) {
				switch (rank) {
					case 'E':
						// console.log("E-Rank role!");
						e = true;
						break;
					case 'D':
						// console.log("D-Rank role!");
						d = true;
						break;
					case 'C':
						// console.log("C-Rank role!");
						c = true;
						break;
					case 'B':
						// console.log("B-Rank role!");
						b = true;
						break;
					case 'A':
						// console.log("A-Rank role!");
						a = true;
						break;
					case 'S':
						// console.log("S-Rank role!");
						s = true;
						break;
					default:
						// ...
						break;
				}
			} else if (r.name == "National Level") {
				// console.log("National Level role!");
				n = true;
			}
		});

		if (!e) interaction.guild?.roles.create({ name: "E-Rank", hoist: true });
		if (!d) interaction.guild?.roles.create({ name: "D-Rank", hoist: true });
		if (!c) interaction.guild?.roles.create({ name: "C-Rank", hoist: true });
		if (!b) interaction.guild?.roles.create({ name: "B-Rank", hoist: true });
		if (!a) interaction.guild?.roles.create({ name: "A-Rank", hoist: true });
		if (!s) interaction.guild?.roles.create({ name: "S-Rank", hoist: true });
		if (!n) interaction.guild?.roles.create({ name: "National Level", hoist: true });

		const allRolesExist = e&&d&&c&&b&&a&&s&&n; // e && d && c && b && a && s && n;
		const content = `Config exists: **${config_exists}**\nAll roles exist: **${allRolesExist}**`;
		await interaction.reply({ content: content, flags: "Ephemeral" });
	}
}

export default {
  command: new SetupCommand()
}
