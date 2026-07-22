import { Client, type ClientOptions, Collection, CommandInteraction, REST, Routes } from "discord.js";
import { glob } from "glob";
import type { CommandData } from "./types/command";
import type Command from "./types/command";
import type Event from "./types/event";
import type Set from "./types/set";

export default class Bot extends Client {
  public readonly sets: Set[] = [];
  public readonly commands = new Collection<string, Command>();
  public readonly msgCommands = new Collection<string, Command>();
  public readonly events = new Collection<string, Event>();
  public readonly buttons = new Collection<string, any>();
  public readonly menus = new Collection<string, any>();
  public readonly modals = new Collection<string, any>();
  public cmdJSONArray: CommandData[] = [];

  constructor(options: ClientOptions) { super(options); }

  public codeBlock(text: string, lang?: string | undefined): string {
    return `\`\`\`${lang ?? `txt`}\n${text}\n\`\`\``;
  }

  public async processSets(): Promise<Set[]> {
    const files = await glob(`${import.meta.dir}/commands/**/*.ts`, { absolute: true });
    for (const file of files) {
      const { default: _set } = await import(file);
      const set: Set = _set;

      this.sets.push(set);
    }

    return this.sets;
  }

  public async registerCommands(): Promise<void> {
    for (const set of this.sets) {
      const command: Command = set.command;

      if (command.data.msg) this.msgCommands.set(command.data.name, command);
      else {
        this.commands.set(command.data.name, command);
        this.cmdJSONArray.push(command.data);
      }

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
    const files = await glob(`${import.meta.dir}/events/**/*.ts`, { absolute: true });

    for (const file of files) {
      const { default: Event } = await import(file);
      const event: Event = new Event();

      event.once ? this.once(event.name, (...args) => event.execute(this, ...args))
        : this.on(event.name, (...args) => event.execute(this, ...args));

      console.log(`🔵 ${event.name} event loaded!`);
    }
  }

  public async registerButtons(): Promise<void> { }
  public async registerMenus(): Promise<void> { }
  public async registerModals(): Promise<void> { }

  /**
   * Checks if the bot is in the given guild.
   * @param guildId ID of the guild to check for.
   * @returns `boolean`
   */
  public async inGuild(guildId: string): Promise<boolean> {
    return await this.guilds.fetch(guildId).then(()=>true).catch(()=>false);
  }
}
