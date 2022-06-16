import type { Command } from '../config/Commands';
import type { Guild, Message } from 'discord.js';
import type { Manager } from 'erela.js';
import { injectable } from 'tsyringe';
import { queueEmbed } from '../utils/functions/Embed';
import { ButtonCollector } from '../utils/collectors/buttonsCollector';
import { PushingButtons } from '../utils/util/components';
import ctx from '../utils/util/ctx.js';
import Player_ from '../utils/extended/ExtendedPlayer';

@injectable()
export default class implements Command {
  public name = 'queue';
  public alias = ['q'];
  public description = `To show the player queue.`;
  constructor() {}
  public async execute(
    message: Message,
    _args: unknown,
    manager: Manager
  ): Promise<unknown> {
    const player = manager.players.get((message.guild as Guild).id) as Player_;
    const AuthorId = message.author.id;
    if (!player) {
      return ctx(
        {
          key: 'errors.player.no_player',
          isEmbed: true
        },
        message
      );
    }

    const buttons_ = PushingButtons([
      {
        customId: '1',
        emoji: '◀️',
      },

      {
        customId: '2',
        emoji: '⬅️',
      },

      {
        customId: '3',
        emoji: '➡️',
      },

      {
        customId: '4',
        emoji: '▶️',
      },
    ]);
      
    const _queue = player.queue;
    const Embeds_ = queueEmbed(_queue, player);
    
  
  
    
    if (player.queue.totalSize === 1) {
      return ctx(
        {
          key: 'errors.no_queue',
        },
        message
      );
    }


    const embed = await message.channel.send({ embeds: [Embeds_[0]] });

    if (player.queue.totalSize > 4) {
      await embed.edit({ components: [buttons_] });
          await ButtonCollector(embed, AuthorId, Embeds_, player);
    }
  }
}
