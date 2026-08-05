import type { APIRole, GuildMember, Role } from "discord.js";

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

	constructor() { }

	/**
	 * Goes through each of the members roles, checking if it is a rank.
	 * @param member The member to check.
	 * @returns A `Role` (which is their rank), or `undefined` if they're unranked.
	 */
	public checkForExistingRank(member: GuildMember): Role | undefined {
		return member.roles.cache.find(r => this.roleNames.includes(r.name));
	}

	public async setRankByMana(mana: number, ranks: {
		e: { minMana: number; }
		d: { minMana: number; }
		c: { minMana: number; }
		b: { minMana: number; }
		a: { minMana: number; }
		s: { minMana: number; }
		n: { minMana: number; }
	}, maxNationalLevels: number): Promise<void> {
		//
	}

	public async awaken(): Promise<void> { }

	public async forceAwaken(): Promise<void> { } // I guess the force awakens? 😏

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
