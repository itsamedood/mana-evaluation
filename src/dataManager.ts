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
	 * Takes all entries in `/guilds` and stores them in `this.cache`.
	 */
	public async cacheAllEntries(): Promise<void> {
		const files = await glob(`${this.dirPath}/*.json`);

		try {
			for (const file of files) {
				const guildId = file.replace('.json', '')
					.replace("guilds/", '') // "guilds/123456.json" => "123456".
					.replace("guilds\\", ''); // Fucking Windows bro.

				const bunFile = Bun.file(`${this.dirPath}/${guildId}.json`);
				const data: ConfigData = await bunFile.json();

				this.cache.set(guildId, data);
				console.log(`📦 Cached ${file}!`);
			}
		} catch (err) { console.error(`Failed to cache! File probably doesn't exist.`, err); }
	}

	/**
	 * Creates a new file in `/guilds`. The name is `<guildId>.json`.
	 */
	public async createNewEntry(guildId: string): Promise<void> {
		if (this.cache.has(guildId)) return;

		try {
			const defaultData = DEFAULT_CONFIG_DATA;
			const path = `${this.dirPath}/${guildId}.json`;

			defaultData.guildId = guildId; // Update this from an empty string to the value.

			Bun.write(path, JSON.stringify(defaultData, null, 2));
			this.cache.set(guildId, defaultData);
			console.log(`Created entry ${path}!`);
		} catch (err) { console.error(`Failed to create entry!`, err); }
	}

	public async removeEntry(guildId: string): Promise<void> {
		const path = `${this.dirPath}/${guildId}.json`;

		try {
			// First, delete the physical file.
			Bun.file(path).delete();

			// Then, remove it from cache (if it's in there, which it should be).
			this.cache.delete(guildId);
		} catch (err) { console.error(`Failed to remove entry! File may not exist.`, err); }
	}
}
