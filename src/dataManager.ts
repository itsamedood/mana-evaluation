import { DEFAULT_CONFIG_DATA } from "./types/configData";
import { glob } from "glob";
import type ConfigData from "./types/configData";

/**
 * Keeps the functions related to `DataManager.cache` seperate, for cleanliness.
 */
export class DMCacheManager extends Map<string, ConfigData> {
	private readonly _dirPath = `${import.meta.dir}/../guilds`; // Bugged!

	/**
	 * Takes all entries in `/guilds` and stores them in `this.cache`.
	 */
	public async cacheAllEntries(entries: string[]): Promise<void> {
		try {
			for (const guildId of entries) {
				const bunFile = Bun.file(`${this._dirPath}/${guildId}.json`);
				const data: ConfigData = await bunFile.json();

				this.set(guildId, data);
				console.log(`📦 Cached ${guildId}.json!`);
			}
		} catch (err) { console.error(`Failed to cache! File probably doesn't exist.`); }
	}

	/**
	 * Modifies data in cache to be written later.
	 * If all parameters are `undefined`, this function sets `data.modified` to `false`.
	 * @param guildId ID of the guild to modify the data of.
	 * @param awakenOdds Set the odds to awaken.
	 * @param maxNationalLevels Set the max number of national levels. 0 for infinite, -1 for none.
	 * @param manaRange Set the min and max of the mana range.
	 * @param ranks Set each ranks min mana requirement.
	 */
	public async modifyData(guildId: string,
		awakenOdds?: number | undefined,
		maxNationalLevels?: number | undefined,
		manaRange?: {min: number, max: number} | undefined,
		ranks?: {
			e: {minMana?: number | undefined},
			d: {minMana?: number | undefined},
			c: {minMana?: number | undefined},
			b: {minMana?: number | undefined},
			a: {minMana?: number | undefined},
			s: {minMana?: number | undefined},
			n: {minMana?: number | undefined},
		} | undefined): Promise<void> {
		try {
			const data = this.get(guildId);
			if (!data) return;

			// If all parameters are undefined, reset data.modified to false.
			if (
				!awakenOdds 			 &&
				!maxNationalLevels &&
				!manaRange				 &&
				!ranks // No ranks would mean no e-n.minMana.
			) { data.modified = false; }
			else {
				data.modified = true;
				if (awakenOdds) data.awakenOdds = awakenOdds;
				if (maxNationalLevels) data.maxNationalLevels = maxNationalLevels;
				if (manaRange) {
					data.manaRange.min = manaRange.min;
					data.manaRange.max = manaRange.max;
				}
				if (ranks) {
					if (ranks.e.minMana) data.ranks.e.minMana =  ranks.e.minMana;
					if (ranks.d.minMana) data.ranks.d.minMana =  ranks.d.minMana;
					if (ranks.c.minMana) data.ranks.c.minMana =  ranks.c.minMana;
					if (ranks.b.minMana) data.ranks.b.minMana =  ranks.b.minMana;
					if (ranks.a.minMana) data.ranks.a.minMana =  ranks.a.minMana;
					if (ranks.s.minMana) data.ranks.s.minMana =  ranks.s.minMana;
					if (ranks.n.minMana) data.ranks.n.minMana =  ranks.n.minMana;
				}

				// Update entry in cache with modified data.
				this.set(guildId, data);
			}
		} catch (err) { console.error(`Failed to modify data for ${guildId}!`, err); }
	}
}

/**
 * Handles everything related to server-specific config data saved in files.
 */
export default class DataManager {
	/**
	 * In-memory cache for each entries data.
	 */
	public readonly cache = new DMCacheManager();

	/**
	 * Converts `ConfigData` to JSON as a `string`.
	 */
	public readonly JSONify = (data: ConfigData): string => { return JSON.stringify(data, null, 2); };

	/**
	 * Checks if the guild has an entry in `/guilds`.
	 */
	public readonly entryExists = (guildId: string): Promise<boolean> => { return Bun.file(`${this._dirPath}/${guildId}.json`).exists(); };

	private readonly _dirPath = `${import.meta.dir}/../guilds`;

	constructor() { }

	/**
	 * Fetches all entries from `/guilds` and returns an array of each entry, without the path or extension.
	 *
	 * Ex. `guilds/1234567890.json` => `1234567890`
	 */
	public async fetchAllEntries(): Promise<string[]> {
		const entries: string[] = [];
		const files = await glob(`${this._dirPath}/*.json`);

		for (const file of files) {
			const guildId = file.replace(".json", '')
				.replace("guilds/", '') // "guilds/123456.json" => "123456".
				.replace("guilds\\", ''); // Fucking Windows bro.

			entries.push(guildId);
		}

		return entries;
	}

	public async validateEntries(guildIds: string[], entryIds: string[]): Promise<void> {
		const guildSet = new Set(guildIds);

		for (const entry of entryIds) !guildSet.has(entry) ? this.removeEntry(entry) : console.log(`👌 ${entry} is valid.`);
	}

	// public async entryExists(guildId: string): Promise<boolean> { return Bun.file(`${this._dirPath}/${guildId}.json`).exists(); }

	/**
	 * Creates a new file in `/guilds`. The name is `<guildId>.json`.
	 *
	 * This function will not do anything IF:
	 * - `DataManager.cache` has the `guildId` in it.
	 * - `DataManager.entryExists(guildId)` returns `true`.
	 */
	public async createNewEntry(guildId: string): Promise<void> {
		if (this.cache.has(guildId)) return;
		if (await this.entryExists(guildId)) return;

		try {
			const defaultData = DEFAULT_CONFIG_DATA;
			const path = `${this._dirPath}/${guildId}.json`;

			defaultData.guildId = guildId; // Update this from an empty string to the value.

			Bun.write(path, this.JSONify(defaultData));
			this.cache.set(guildId, defaultData);
			console.log(`📥 Created entry ${path}!`);
		} catch (err) { console.error(`Failed to create entry!`, err); }
	}

	/**
	 * Removes an entry in `/guilds`.
	 */
	public async removeEntry(guildId: string): Promise<void> {
		const path = `${this._dirPath}/${guildId}.json`;

		try {
			Bun.file(path).delete(); // First, delete the physical file.
			this.cache.delete(guildId); // Then, remove it from cache.

			console.log(`📤 Removed entry ${path}!`);
		} catch (err) { console.error(`Failed to remove entry! File may not exist.`, err); }
	}

	/**
	 * Writes data to `guilds/<guildId>.json` (data is cached).
	 */
	public async writeToEntry(guildId: string): Promise<void> {
		if (!this.cache.has(guildId) || !(await this.entryExists(guildId))) return;

		try {
			const path = `${this._dirPath}/${guildId}.json`;
			const data = this.cache.get(guildId);

			if (!data) return;
			Bun.write(path, this.JSONify(data));
		} catch (err) { console.error(`Failed to write to guilds/${guildId}.json!`, err); }
	}

	public async writeAllModifiedEntries(): Promise<void> {
		for (const data of this.cache.values().filter(v => v.modified)) {
			this.writeToEntry(data.guildId);
		}
	}
}
