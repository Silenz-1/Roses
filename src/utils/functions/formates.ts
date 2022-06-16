//import { APIEmbed } from "discord-api-types/v10";
import { Formatters, Message, TextChannel } from "discord.js";
import type { Player, Track, UnresolvedTrack } from "erela.js";
import pm from "pretty-ms";
export const formates = {
  player: {
    DefaultEmbed_f1: (message: Message, player: Player, track: (Track | UnresolvedTrack)): void => {
      const duration_: any = pm((track.duration as number), {colonNotation: true});
      const FloatToInt = duration_.includes('.') ? duration_.split('.')[0] : duration_;
      const channel = message.channel as TextChannel;

      if (player.queue.size === 0) {
        channel.send({
          embeds: [
            {
              author: {
                name: `Starting Music Player`,
              },
              description: `Joined ${message.member?.voice.channel} voice channel by ${track.requester}`,
              color: `AQUA`,
            },
          ],
        });
      }
      if (player.queue.size >= 1) {
        channel.send({
          embeds: [
            {
              author: {
                name: `Player queue`,
                iconURL: `
                        ${
                          message.guild?.iconURL({ dynamic: true })
                            ? message.guild?.iconURL({ dynamic: true })
                            : ``
                        }`,
              },
              description: `
                        ✵ Added ${Formatters.hyperlink(
                          `${track.title}`,
                          `${track.uri}`
                        )} to the queue by ${track.requester}
                    `,
              thumbnail: {
                //@ts-expect-error
                url: `${!track.thumbnail ? `` : track.displayThumbnail("maxresdefault")}`,
              },
              fields: [
                {
                  name: "\u200b",
                  value: `✵ position no. **${player.queue.size}** in queue`,
                  inline: true,
                },

                {
                  name: "\u200b",
                  value: `✵ song duration: **${FloatToInt}**`,
                  inline: true,
                },
              ],
              color: `AQUA`,
            },
          ],
        });
      }
    },

    TrackStartEmbed_f2: async (channel: TextChannel, track: Track): Promise<Message> => {
      return await channel.send({
        embeds: [
          {
            description: `🎵 Now playing **➛** __[${track.title}](${track.uri})__`,
            color: `AQUA`,
            
          },
        ],
      });
    },
  },
};
