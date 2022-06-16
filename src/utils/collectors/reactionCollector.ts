import type {
  Message,
  MessageReaction,
  ReactionCollector,
  Snowflake,
  User,
} from "discord.js";
import { reactionperms } from "../functions/permissions/botperms";
import type Player_ from "../extended/ExtendedPlayer";
import ctx from "../ctx";

export async function collector(
  message: Message,
  Emojis: string[],
  AuthId: Snowflake,
  ops?: Player_
): Promise<void> {
  const player = ops as Player_;

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

      ctx({
        key: `Loading \`${tracks_.length}\` tracks to the queue.`,
        isEmbed: false
      }, message)
    
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
      ctx({
        key: 'Skipped Loading this playlist to the queue.',
        isEmbed: false
      }, message)
      return;
    }
  });

  collector.once("end", async () => {
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