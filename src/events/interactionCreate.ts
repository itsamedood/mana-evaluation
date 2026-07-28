import {
  ChannelType,
  InteractionType,
  ChatInputCommandInteraction,
  MessageFlags,
  EmbedBuilder,
  type AnySelectMenuInteraction,
  type ButtonInteraction,
  type CommandInteraction,
  type ModalSubmitInteraction
} from "discord.js";

import Event from "../types/event";
import Bot from "../bot";

class InteractionCreateEvent extends Event {
  constructor() {
    super({ name: "interactionCreate" });
  }

  public async execute(client: Bot, interaction: CommandInteraction |
    ButtonInteraction | AnySelectMenuInteraction |
    ModalSubmitInteraction | ChatInputCommandInteraction) {
    /* Application command interactions. */
    if (interaction.type == InteractionType.ApplicationCommand) {
      if (interaction.channel?.type == ChannelType.DM)
        return await interaction.reply({ content: "You can't slide into my DMs bruh." });

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

			// If category is NL and member is NOT and admin or is NOT the owner, deny usage.
			if (command.category == "NL" && !(interaction.memberPermissions?.has("Administrator") || interaction.guild?.ownerId == interaction.member?.user.id))
				return await interaction.reply({ content: "You can't use this.", flags: "Ephemeral" });

      try {
        // @ts-ignore
        await command.execute(interaction, client);
      } catch (err) {
        const errorEmbed = new EmbedBuilder({
          title: "Error!",
          description: client.codeBlock(String(err), 'ts')
        }).setColor("#FF0000"); // Bright red.

        await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        console.error(err);
      }
    }
  }
}

export default {
	name: new InteractionCreateEvent()
}
