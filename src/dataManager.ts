import { DEFAULT_CONFIG_DATA } from "./types/configData";
import { glob } from "glob";
import type ConfigData from "./types/configData";

/**
 * Handles everything related to server-specific config data saved in files.
 */
export default class DataManager {
	public cache = new Map<string, ConfigData>();
	private dirPath = `${import.meta.dir}/../guilds`;

	constructor() { }

	/**
	 * Fetches all entries from `/guilds` and returns an array of each entry, without the path or extension.
	 *
	 * Ex. `guilds/1234567890.json` => `1234567890`
	 */
	public async fetchAllEntries(): Promise<string[]> {
		const entries: string[] = [];
		const files = await glob(`${this.dirPath}/*.json`);

		for (const file of files) {
			const guildId = file.replace(".json", '')
				.replace("guilds/", '') // "guilds/123456.json" => "123456".
				.replace("guilds\\", ''); // Fucking Windows bro.

			entries.push(guildId);
		}

		return entries;
	}

	/**
	 * Takes all entries in `/guilds` and stores them in `this.cache`.
	 */
	public async cacheAllEntries(entries: string[]): Promise<void> {
		try {
			for (const guildId of entries) {
				const bunFile = Bun.file(`${this.dirPath}/${guildId}.json`);
				const data: ConfigData = await bunFile.json();

				this.cache.set(guildId, data);
				console.log(`📦 Cached ${guildId}.json!`);
			}
		} catch (err) { console.error(`Failed to cache! File probably doesn't exist.`); }
	}

	public async validateEntries(guildIds: string[], entryIds: string[]): Promise<void> {
		const guildSet = new Set(guildIds);

		for (const entry of entryIds) !guildSet.has(entry) ? this.removeEntry(entry) : console.log(`👌 ${entry} is valid.`);
	}

	/**
	 * Checks if the guild has an entry in `/guilds`.
	 */
	public async entryExists(guildId: string): Promise<boolean> { return Bun.file(`${this.dirPath}/${guildId}.json`).exists(); }

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
			const path = `${this.dirPath}/${guildId}.json`;

			defaultData.guildId = guildId; // Update this from an empty string to the value.

			Bun.write(path, JSON.stringify(defaultData, null, 2));
			this.cache.set(guildId, defaultData);
			console.log(`📥 Created entry ${path}!`);
		} catch (err) { console.error(`Failed to create entry!`, err); }
	}

	/**
	 * Removes an entry in `/guilds`.
	 */
	public async removeEntry(guildId: string): Promise<void> {
		const path = `${this.dirPath}/${guildId}.json`;

		try {
			Bun.file(path).delete(); // First, delete the physical file.
			this.cache.delete(guildId); // Then, remove it from cache.

			console.log(`📤 Removed entry ${path}!`);
		} catch (err) { console.error(`Failed to remove entry! File may not exist.`, err); }
	}
}
