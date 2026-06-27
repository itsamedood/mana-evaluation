import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../bot";
import Command from "../types/command";

class PingCommand extends Command {
  constructor() {
    super({
      data: {
        name: "ping",
        description: "Pong! Used to check latency."
      },
      category: "SETTINGS"
    });
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    const latency = Date.now() - interaction.createdTimestamp
    return await interaction.reply({ content: `# Pong!\n> :ping_pong: **Latency:** \`${latency}ms\`` });
  }
}

export default {
  command: new PingCommand()
}
