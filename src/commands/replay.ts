import type { Command } from '../config/Commands';
import type { Message, Guild } from 'discord.js';
import { injectable } from 'tsyringe';
import type { Manager } from 'erela.js';
import { CheckDjrole } from '../structures/db_managing/setting_djrole';
import { GetExcludes } from '../structures/db_managing/setting_Excludes';
import ctx from '../utils/util/ctx';
@injectable()
export default class implements Command {
  public name = 'replay';
  public alias = [];
  public description = `To replay the current track.`;
  constructor() {}
  public async execute(
    message: Message,
    _args: unknown,
    manager: Manager
  ): Promise<unknown> {
    const ExcludedCommands_ = await GetExcludes(message.guildId);

    if (!ExcludedCommands_.includes(`${this.name}`)) {
      if (!(await CheckDjrole(message))) return;
    }
    const player = manager.players.get((message.guild as Guild).id);

    if (!player) {
      return ctx(
        {
          key: 'errors.player.no_player',
        },
        message
      );
    }

    if (
      message.guild?.me?.voice.channelId &&
      message.member?.voice.channelId !== message.guild.me.voice.channelId
    ) {
      return ctx(
        {
          key: 'errors.player.not_the_same_vc',
        },
        message
      );
    }

    player.seek(0);
    await message.react('✅');
  }
}
