import type {
  Message,
  MessageEmbed,
  MessageReaction,
  ReactionCollector,
  Snowflake,
  User,
} from "discord.js";
import { reactionperms } from "../functions/permissions/botperms.js";
import type Player_ from "../extended/ExtendedPlayer.js";

export async function collector(
  message: Message,
  Emojis: string[],
  AuthId: Snowflake,
  ops?: MessageEmbed[] | Player_
): Promise<void> {
  let page = 0;
  const player = ops as Player_;
  const embeds = ops as MessageEmbed[]
 
  if (!reactionperms(message)) return;

  Emojis.forEach(async (emoji) => {
    await message.react(emoji);
  });

  const filter = (reaction: MessageReaction, user: User): boolean => {
    return Emojis.includes(reaction.emoji.name as string) && user.id === AuthId;
  };

  const collector: ReactionCollector = message.createReactionCollector({
    filter,
    idle: 30_000,
  });

  collector.on("collect", async (reaction) => {
    if (reaction.emoji.name === "❌") {
      return await message.delete();
    }

    if (reaction.emoji.name === "➡️") {
      if (page < embeds.length - 1) {
        page++;
        return await message.edit({
          embeds: [embeds[page]],
        });
      }
    }

    if (reaction.emoji.name === "⬅️") {
      if (page !== 0) {
        return await message.edit({
          embeds: [embeds[page]],
        });
      }
    }

    if (reaction.emoji.name === "🔂") {
      if (!player.trackRepeat) {
        return player.setTrackRepeat(true);
      }
    }

    if (reaction.emoji.name === "⏸️") {
      if (!player.paused) {
        return player.pause(true);
      }
    }

    if (reaction.emoji.name === "▶️") {
      if (player.paused) {
        return player.pause(false);
      }
    }

    if (reaction.emoji.name === "⏹️") {
      return player.stop();
    }

    if (reaction.emoji.name === "✅") {
      collector.stop();
      const tracks_ = player.filtredTracks;
      message.channel.send({
        embeds: [
          { 
            description: `Loading \`${ tracks_.length}\` tracks to the queue`, 
            color: "YELLOW" 
          }
        ],
      });
      if (player.state !== "CONNECTED") player.connect();
      player.queue.add(tracks_);
      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === tracks_.length
      ) {
        await player.play();
      }
    }

    if (reaction.emoji.name === "❎") {
      collector.stop();
      message.channel.send(`Skipped adding the playlist to the queue.`);
      return;
    }
  });

  collector.on("end", async () => {
    try {
    await message.reactions.removeAll();
    } catch (e) {
      Emojis.forEach(async (emoji) => {
        const Emoji_ = message.reactions.cache.get(emoji);
        await Emoji_?.users.remove(message.client.user?.id);
      });
    }
  });
}