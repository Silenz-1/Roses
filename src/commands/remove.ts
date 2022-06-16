import type { Command } from "../config/Commands";
import type { Message, Guild } from "discord.js";
import { injectable } from "tsyringe";
import type { Manager } from "erela.js";
import { CheckDjrole } from "../structures/db_managing/setting_djrole";
import { GetExcludes } from "../structures/db_managing/setting_Excludes";
import ctx from "../utils/util/ctx.js";
@injectable()
export default class implements Command {
  public name = "remove";
  public alias = [];
  public description = `To remove a specified track/tracks from the qeueu.`
  constructor() {}
  public async execute(
    message: Message,
    args: [number, number] ,
    manager: Manager
  ): Promise<unknown> {
    const ExcludesCommands_ = await GetExcludes(message.guildId);

      if (!ExcludesCommands_.includes(`${this.name}`)) {
        if (!await CheckDjrole(message)) return;
      }
    const player = manager.players.get((message.guild as Guild).id);

      if (!player) {
        return ctx({
          key: 'errors.player.no_player'
        }, message)
      };

        if (
          message.guild?.me?.voice.channelId &&
            message.member?.voice.channelId !== message.guild.me.voice.channelId
        ) {
          return ctx({
            key: 'errors.player.not_the_same_vc'
          }, message)
        };

            if (player.queue.totalSize === 1) {
              return ctx({
                key: 'errors.no_queue'
              }, message)
            };

              if (!args[0]) return message.channel.send({ embeds: [
                  {
                    description: this.description, 
                    color: `AQUA`
                  }
                  ] 
                });

                if (args[0] && !args[1]) {
                    if (isNaN(args[0]) || args[0] < 1 || args[0] > player.queue.size) return;
                        player.queue.remove(args[0] - 1);
                            await message.react('✅');
                }

                    if (args[0] && args[1]) {
                        if (
                          isNaN(args[0]) 
                            || isNaN(args[1]) 
                              || args[0] >= args[1] 
                                || args[1] > player.queue.size
                        ) return;
          
                          player.queue.remove(args[0], args[1])
                            await message.react('✅');
                    }
                  
  }
}
