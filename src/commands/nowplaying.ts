import type { Command } from '../config/Commands';
import type { Message, Guild } from 'discord.js';
import { injectable } from 'tsyringe';
import type { Manager, Track } from 'erela.js';
import { collector } from '../utils/collectors/reactionCollector';
import pm from 'pretty-ms';
import type Player_ from '../utils/extended/ExtendedPlayer';
import ctx from '../utils/util/ctx';
@injectable()
export default class implements Command {
  public name = 'nowplaying';
  public alias = ['np'];
  public description = `To check the current playing track.`;
  constructor() {}
  public async execute(
    message: Message,
    _args: unknown,
    manager: Manager
  ): Promise<unknown> {
    const player = manager.players.get((message.guild as Guild).id) as Player_;

    if (!player) {
      return ctx(
        {
          key: 'errors.player.no_player',
        },
        message
      );
    }
    const _currentTrack = player.queue.current as Track;

    const Bar = player.progressBar(
      player.position / 1000 / 50,
      _currentTrack.duration / 1000 / 50,
      12,
      player.position
    );

    const msg = await ctx(
      {
        key: 'progressBar',
        options: {
          trackTitle: _currentTrack.title,
          barTime: Bar.barTime,
          barProgress: Bar.barProgress,
          requester: _currentTrack.requester,
          trackDuration: pm(_currentTrack.duration, { colonNotation: true }),
        },
      },
      message,
      'AQUA'
    );

    collector(msg, ['🔂', '⏸️', '▶️', '⏹️'], message.author.id, player);
  }
}
