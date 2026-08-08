import type { APIRole, GuildMember, Role } from "discord.js";
import type ConfigData from "./types/configData";

/**
 * Handles rank stuff in guilds.
 */
export default class RankManager {
	public readonly roleNames = ["E-Rank", "D-Rank", "C-Rank", "B-Rank", "A-Rank", "S-Rank", "National Level"];

	/**
	 * Picks a random number between `min` and `max` as the mana range.
	 * @returns Said random number.
	*/
	public readonly rollMana = (min: number, max: number): number => { return (Math.random() * (max - min)) + min; }

	/**
	 * Rolls a random number between 0 and 100, and compares to `odds`. Automatically returns `true` if `odds` is `100`.
	 * @param odds Awakening odds (default: 0.5%).
	 * @returns `boolean`.
	 */
	public readonly rollAwakening = (odds: number): boolean => { return odds != 100 ? (Math.random() * 100) < odds : true; }

	/**
	 * Goes through each of the members roles, checking if it is a rank.
	 * @param member The member to check.
	 * @returns A `Role` (which is their rank), or `undefined` if they're unranked.
	 */
	public checkForExistingRank(member: GuildMember): Role | undefined {
		return member.roles.cache.find(r => this.roleNames.includes(r.name));
	}

	public setRankByMana(mana: number, ranks: {
		e: { minMana: number; }
		d: { minMana: number; }
		c: { minMana: number; }
		b: { minMana: number; }
		a: { minMana: number; }
		s: { minMana: number; }
		n: { minMana: number; }
	}, maxNationalLevels: number): string | undefined {
		// This code REALLY fucking suuuuuucks.
		let [e, d, c, b, a, s, n]: Array<string | undefined> = this.roleNames;

		if (mana >= ranks.n.minMana && maxNationalLevels > 0) {
			// Account for maxNationalLevels and such here.
			// For now fuck it.
			// Also my wifey is getting her nails done and the file is so fucking annoying send help.

			return n;
		}
		if (mana >= ranks.s.minMana) return s;
		if (mana >= ranks.a.minMana) return a;
		if (mana >= ranks.b.minMana) return b;
		if (mana >= ranks.c.minMana) return c;
		if (mana >= ranks.d.minMana) return d;
		if (mana >= ranks.e.minMana || mana < ranks.e.minMana) return e; // Just in case.
	}

	/**
	 * Awakens a member! This function does **NOT** update the cache automatically.
	 *
	 * You will need to call:
	 * ```ts
	 * client.dataMngr.cache.set(message.guild.id, newConfigData);
	 * ```
	 * @param memberId ID of the member that awakened.
	 * @param configData Config data of the guild the awakening occurred in.
	 * @return Modified `configData` (with member added to `awakenedUsers` map, and `modified` to `true`).
	 */
	public awaken(memberId: string, configData: ConfigData): ConfigData {
		const mana = this.rollMana(configData.manaRange.min, configData.manaRange.max);
		configData.awakenedUsers.set(memberId, mana);
		configData.modified = true;

		return configData;
	}

	/**
	 * Force sets the rank of a member, awakened or not.
	 * @param member Member to set the rank of.
	 * @param role The role to use. Must be a rank role.
	 * @returns `true` if the rank was set, and `false` if the role is not a rank role.
	 */
	public async forceSetRank(member: GuildMember, role: Role | APIRole): Promise<boolean> {
		const currentRank = this.checkForExistingRank(member);

		if (!this.roleNames.includes(role.name)) return false;

		if (currentRank) {
			if (currentRank.id != role.id) {
				await member?.roles.remove(currentRank.id);
				await member?.roles.add(role.id);
			}
		} else await member?.roles.add(role.id);

		return true;
	}
}
