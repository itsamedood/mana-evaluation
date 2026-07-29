import { DEFAULT_CONFIG_DATA } from "./types/configData";
import type ConfigData from "./types/configData";

/**
 * Handles everything related to server-specific config data saved in files.
 */
export default class DataManager {
	public cache = new Map<string, ConfigData>();
	private dirPath = "../guilds";

	/**
	 * Takes all entries in `/guilds` and stores them in `this.cache`.
	 */
	public async cacheAllEntries(): Promise<void> {
		//
	}

	/**
	 * Creates a new file in `/guilds`. The name is `<guildId>.json`.
	 */
	public async createNewEntry(guildId: string): Promise<void> {
		if (this.cache.has(guildId)) return;

		const defaultData = DEFAULT_CONFIG_DATA;

		Bun.write(`${this.dirPath}/${guildId}.json`, JSON.stringify(defaultData, null, 2));
		this.cache.set(guildId, defaultData);
	}

	public async removeEntry(guildId: string): Promise<void> {
		//
	}
}
