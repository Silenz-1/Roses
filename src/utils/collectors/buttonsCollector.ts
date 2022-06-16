import {
  Message,
  MessageComponentInteraction,
  MessageEmbed,
  Snowflake,
} from 'discord.js';
import { disable } from '../components';
import { APIEmbed } from 'discord-api-types/v10';
import Player_ from '../extended/ExtendedPlayer';

export async function ButtonCollector(
  message: Message,
  AuthId: Snowflake,
  Embeds: APIEmbed[],
  player: Player_
): Promise<void> {
  let page = 0;
  const isLopped = player.queueRepeat ? ` | queue is being lopped` : '';
  const filter = async (
    interaction: MessageComponentInteraction
  ): Promise<boolean> => {
    const Embed = new MessageEmbed()
      .setDescription("You're not the invoker of this message.")
      .setColor('YELLOW');

    if (interaction.user.id === AuthId) return true;
    await interaction.reply({
      embeds: [Embed],
      ephemeral: true,
    });
    return false;
  };

  const collector = message.createMessageComponentCollector({
    filter,
    componentType: 'BUTTON',
    idle: 30_000,
    time: 300_000,
  });
  collector.on('collect', async (interaction) => {
    switch (interaction.customId) {
      case '1':
        if (page !== 0) {
          page = 0;

          Embeds.forEach((embed) => {
            embed.footer!.text = `Page: ${page + 1} / ${
              Embeds.length
            } ${isLopped}`;
          });
          return await interaction.update({ embeds: [Embeds[page]] });
        }
        await interaction.deferUpdate();
        break;

      case '2':
        if (page !== 0) {
          page--;

          Embeds.forEach((embed) => {
            embed.footer!.text = `Page: ${page + 1} / ${
              Embeds.length
            } ${isLopped}`;
          });
          return await interaction.update({ embeds: [Embeds[page]] });
        }
        await interaction.deferUpdate();
        break;

      case '3':
        if (page < Embeds.length - 1) {
          page++;

          Embeds.forEach((embed) => {
            embed.footer!.text = `Page: ${page + 1} / ${
              Embeds.length
            } ${isLopped}`;
          });
          return await interaction.update({ embeds: [Embeds[page]] });
        }
        await interaction.deferUpdate();
        break;

      case '4':
        if (page < Embeds.length - 1) {
          page = Embeds.length - 1;

          Embeds.forEach((embed) => {
            embed.footer!.text = `Page: ${page + 1} / ${
              Embeds.length
            } ${isLopped}`;
          });
          return await interaction.update({ embeds: [Embeds[page]] });
        }
        await interaction.deferUpdate();
        break;
    }
  });

  collector.once('end', async () => {
    await message.edit({ components: [disable()] });
  });
}
