import type { Queue } from 'erela.js';
import { APIEmbed } from 'discord-api-types/v10';
import i18next from 'i18next';
import _ from 'lodash';
import Player_ from '../extended/ExtendedPlayer';
export function Embed(embedOps: APIEmbed): APIEmbed {
  return embedOps;
}

export function queueEmbed(queue: Queue, player: Player_): APIEmbed[] {
  const currentTrack = player.queue.current!;
  const splittedQueue = _.chunk(queue, 10);

  const embeds = splittedQueue.map((queueTracks) => {
    const strings_ = `__Rest of the queue**:**__\n${queueTracks
      .map((track) => {
        return `${queue.indexOf(track) + 1}- [${track.title}](${
          track.uri
        }) — requested by ${track.requester}`;
      })
      .join(`\n`)}`;

    return Embed({
      description: ` 
              ${i18next.t('Embeds.queueEmbed', {
                title: currentTrack.title,
                URL: currentTrack.uri,
                requester: currentTrack.requester,
                rest: strings_,
              })}
              
              `,
      color: 1752220,
      footer: {
        text: '',
      },
    });
  });

  if (embeds.length > 1) {
    embeds[0].footer!.text = `Page: 1 / ${embeds.length}`;
    if (player.queueRepeat) {
      embeds[0].footer!.text =
        embeds[0].footer?.text + ' | queue is being lopped';
    }
  }

  if (player.queueRepeat && embeds.length < 2) {
    embeds[0].footer!.text = 'queue is being lopped';
  }

  return embeds;
}
