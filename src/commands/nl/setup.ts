import { ChatInputCommandInteraction, Collection, Role } from "discord.js";
import Bot from "../../bot";
import Command from "../../types/command";

class SetupCommand extends Command {
	private e = false;
	private d = false;
	private c = false;
	private b = false;
	private a = false;
	private s = false;
	private n = false; // n = National Level.
	private madeRoles = false;

  constructor() {
    super({
      data: {
        name: "setup",
        description: "Setup the rank roles and config data."
      },
      category: "NL"
    });
  }

	private async _rolesExist(roles: Collection<string, Role> | undefined): Promise<boolean> {
		roles?.forEach((r) => {
			let rank = r.name.charAt(0);
			let endsWithDashRank = r.name.endsWith("-Rank");

			if (endsWithDashRank) {
				switch (rank) {
					case 'E':
						this.e = true;
						break;
					case 'D':
						this.d = true;
						break;
					case 'C':
						this.c = true;
						break;
					case 'B':
						this.b = true;
						break;
					case 'A':
						this.a = true;
						break;
					case 'S':
						this.s = true;
						break;
					default: break;
				}
			} else if (r.name == "National Level") this.n = true;
		});

		return this.e&&this.d&&this.c&&this.b&&this.a&&this.s&&this.n
	}

	private async _dealWithRoles(interaction: ChatInputCommandInteraction): Promise<void> {
		const roles = await interaction.guild?.roles.fetch();

		if (!this._rolesExist(roles)) {
			this.madeRoles = true;

			if (!this.e) interaction.guild?.roles.create({ name: "E-Rank", hoist: true });
			if (!this.d) interaction.guild?.roles.create({ name: "D-Rank", hoist: true });
			if (!this.c) interaction.guild?.roles.create({ name: "C-Rank", hoist: true });
			if (!this.b) interaction.guild?.roles.create({ name: "B-Rank", hoist: true });
			if (!this.a) interaction.guild?.roles.create({ name: "A-Rank", hoist: true });
			if (!this.s) interaction.guild?.roles.create({ name: "S-Rank", hoist: true });
			if (!this.n) interaction.guild?.roles.create({ name: "National Level", hoist: true });
		}
	}

	// private async _dealWithConfigChannel(interaction: ChatInputCommandInteraction) {
	// 	const channels = await interaction.guild?.channels.fetch();
	// 	let config_channel = channels?.find(c => c?.name == this.configChannelName);

	// 	if (!config_channel) {
	// 		this.madeChannel = true;
	// 		interaction.guild?.channels.create({ name: this.configChannelName });
	// 	}
	// }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
		// this._dealWithConfigChannel(interaction);
		this._dealWithRoles(interaction);

		const rolesMsg = this.madeRoles ? `Created 1 or more rank roles.` : `All rank roles already exist.`;
		const content = `${rolesMsg}\n\n**Finished setup!**`

		return await interaction.reply({ content: content });
	}
}

export default {
  name: new SetupCommand()
}
