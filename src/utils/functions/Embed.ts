import type { MessageEmbed } from "discord.js";
import type { Track, Queue, UnresolvedTrack } from "erela.js";
import { formates } from "./formates.js";

export function queueEmbed(queue: Queue, track: (Track | UnresolvedTrack)): MessageEmbed[] {
  const { player: { queueEmbed_f3 } } = formates;
  const embeds = [];
  let k = 3;

  for (let i = 0; i < queue.length; i += 3) {
    const sliced = (queue.slice(i, k)) as (Track | UnresolvedTrack)[]
    k += 3;
    embeds.push(queueEmbed_f3(sliced, track, i));
  }

  return embeds;
}
