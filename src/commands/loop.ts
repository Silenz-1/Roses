import type { Command } from "../config/Commands";
import type { Message, Guild } from "discord.js";
import { injectable } from "tsyringe";
import type { Manager } from "erela.js";
import { CheckDjrole } from "../structures/db_managing/setting_djrole.js";
import { GetExcludes } from "../structures/db_managing/setting_Excludes.js";
import ctx from "../utils/util/ctx.js";
@injectable()
export default class implements Command {
  public name = "loop";
  public alias = ['l'];
  public description = `To loop the current track.\n\n\`aliases:\` **${this.alias}**`
  constructor() {}
  public async execute(
    message: Message,
    _args: unknown,
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
      }
    
        if (
          message.guild?.me?.voice.channelId &&
          message.member?.voice.channelId !== message.guild.me.voice.channelId
          ) {
              return ctx({
                key: 'errors.player.not_the_same_vc'
              }, message)
            }
  
                if (player.trackRepeat) {
                    player.setTrackRepeat(false)
                        await message.react('✅')
                } 

                        else {
                            player.setTrackRepeat(true)
                                await message.react('✅')
                        }
                
  }
}