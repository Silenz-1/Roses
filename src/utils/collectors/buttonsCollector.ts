import type {
  Message,
  MessageActionRow,
  MessageComponentInteraction,
  MessageEmbed,
  Snowflake
} from "discord.js";
import { disable } from "../util/components.js";
import { formates } from "../functions/formates.js";

const { player: { displayingPagination } } = formates;
export async function ButtonCollector(
  message: Message,
  AuthId: Snowflake,
  Embeds: MessageEmbed[], 
  _buttons: MessageActionRow
): Promise<void> {
  let page = 0;
  const filter = async (interaction: MessageComponentInteraction): Promise<boolean> => {
    if (interaction.user.id === AuthId) return true;
    await interaction.reply({
      embeds: [],
      ephemeral: true,
    });
    return false;
  };
    
  const collector = message.createMessageComponentCollector({
    filter,
    componentType: "BUTTON",
    idle: 30_000, 
    time: 300_000
  });
  collector.on("collect", async (interaction) => {
    switch(interaction.customId) {
      case "1":   
        if (page !== 0) {
          page = 0;
          displayingPagination(Embeds.length, page, Embeds)
          return await interaction.update({ embeds: [Embeds[page]] })
        }
        await interaction.deferUpdate();
      break;

      case "2": 
        if (page !== 0) {
          page--; 
          displayingPagination(Embeds.length, page, Embeds)
          return await interaction.update({ embeds: [Embeds[page]] });
        }
        await interaction.deferUpdate();
      break;

      case "3": 
        if (page < Embeds.length - 1) {
          page++;
          displayingPagination(Embeds.length, page, Embeds)
          return await interaction.update({ embeds: [Embeds[page]] });
        }
        await interaction.deferUpdate();
      break;

      case "4": 
        if (page < Embeds.length - 1) {
          page = Embeds.length - 1;
          displayingPagination(Embeds.length, page, Embeds)
          return await interaction.update({ embeds: [Embeds[page]] })
        }
        await interaction.deferUpdate();
      break;
    }
  });

  collector.once("end", async() => {
    await message.edit({ components: [disable()] })
  })
}
