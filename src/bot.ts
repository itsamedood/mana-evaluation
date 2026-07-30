import { Client, type ClientOptions, Collection, REST, Routes } from "discord.js";
import { glob } from "glob";
import type { CommandData } from "./types/command";
import type Button from "./types/button";
import type ConfigData from "./types/configData";
import type Set from "./types/set";
import Command from "./types/command";
import DataManager from "./dataManager";
import Event from "./types/event";

export default class Bot extends Client {
	public readonly dataMngr = new DataManager();
  public readonly sets: Set[] = [];
	public readonly eventSets: Set[] = [];
  public readonly commands = new Collection<string, Command>();
  public readonly buttons = new Collection<string, Button>();
	public configCache = new Map<string, ConfigData>(); // guildId => ConfigData;
  public cmdJSONArray: CommandData[] = [];

  constructor(options: ClientOptions) { super(options); }

  public codeBlock(text: string, lang?: string | undefined): string {
    return `\`\`\`${lang ?? `txt`}\n${text}\n\`\`\``;
  }

	/**
	 * Goes through all guilds this client is in, and checks they have an entry in `/guilds`.
	 */
	public async ensureAllGuildsHaveAnEntry(): Promise<void> {
		const guilds = await this.guilds.fetch();

		for (const guildId of guilds.keys())
			await this.dataMngr.createNewEntry(guildId);

		this.guilds.cache.clear();
	}

	public async processEventSets(): Promise<void> {
		// No need for **/ because event files aren't nested in subdirs.
		const files = await glob(`${import.meta.dir}/events/*.ts`, { absolute: true });
		for (const file of files) {
			const { default: _set } = await import(file);
			const set: Set = _set;

			this.eventSets.push(set);
		}
	}

  public async processSets(): Promise<void> {
    const files = await glob(`${import.meta.dir}/commands/**/*.ts`, { absolute: true });
    for (const file of files) {
      const { default: _set } = await import(file);
      const set: Set = _set;

      this.sets.push(set);
    }
  }

  public async registerCommands(): Promise<void> {
    for (const set of this.sets) {
      const command: Command | Event = set.name;
			if (!(command instanceof Command)) return; // If it (for some reason) isn't a command.

			this.commands.set(command.data.name, command);
			this.cmdJSONArray.push(command.data);

      console.log(`🟢 ${command.data.name} command registered!`);
    }

    const clientId = process.env["CLIENT_ID"] ?? '';
    const rest = new REST({ version: '9' }).setToken(process.env["TOKEN"] ?? '');

    (async (): Promise<void> => {
      try {
        console.log(`🔁 Attempting to refresh ${this.sets.length} commands...`);

        const data: any = await rest.put(
          Routes.applicationCommands(clientId),
          { body: this.cmdJSONArray }
        );

        return console.log(`✅ Successfully loaded ${data.length} commands!`);
      } catch (err) {
        console.log(`🚨 Failed to register & refresh applc`);
        return console.error(err);
      }
    })();
  }

  public async registerEvents(): Promise<void> {
    for (const set of this.eventSets) {
			const event = set.name;
			if (!(event instanceof Event)) return; // If it (for some reason) isn't of type Event.

			event.once ? this.once(event.name, (...args) => event.execute(this, ...args))
				: this.on(event.name, (...args) => event.execute(this, ...args));

      console.log(`🔵 ${event.name} event loaded!`);
    }
  }

	public async registerButtons(): Promise<void> {
		for (const set of this.sets.concat(this.eventSets)) {
			if (set.buttons)
				for (const button of set.buttons) {
					this.buttons.set(button.customId, button);
					console.log(`🟤 ${button.customId} button registered!`);
				}
			else continue;
		}
	}

  // public async registerMenus(): Promise<void> { }
  // public async registerModals(): Promise<void> { }

  /**
   * Checks if the bot is in the given guild.
   * @param guildId ID of the guild to check for.
   * @returns `boolean`
   */
  public async inGuild(guildId: string): Promise<boolean> {
    return await this.guilds.fetch(guildId).then(()=>true).catch(()=>false);
  }
}
