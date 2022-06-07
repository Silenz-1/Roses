import type { Command } from "../../config/Commands";
import type { Message } from "discord.js";
import { injectable } from "tsyringe";
import { GetPrefix } from "../../structures/db_managing/setting_prefix.js";
import { GetMaxqueue } from "../../structures/db_managing/setting_maxqueue.js";
import { GetDjrole } from "../../structures/db_managing/setting_djrole.js";
import { GetAnnounce } from "../../structures/db_managing/setting_announce.js";
import { GetTrackTime } from "../../structures/db_managing/setting_tracktime.js";
import pm from 'pretty-ms'
@injectable()
export default class implements Command {
  public name = "settings";
  public alias = [];
  public description = `To show the current settings of the guild.`;
  constructor() {}
  public async execute(message: Message, _args: unknown): Promise<void> {
    message.channel.send({ 
        embeds: [
            {       
                description: 
                `**prefix:** \`${await GetPrefix(message.guildId)}\`\n**djrole:** \`${await GetDjrole(message.guildId)}\`\n**maxqueuetracks:** \`${await GetMaxqueue(message.guildId)}\`\n**maxtrackduration:** \`${pm(await GetTrackTime(message.guildId))}\`\n**announce:** \`${await GetAnnounce(message.guildId)}\``,
                author: {
                    name: `${message.guild?.name}'s settings`
                },
                color: `AQUA`
            }
        ]
    });
  }
}
