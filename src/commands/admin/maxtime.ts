import type { Command } from "../../config/Commands";
import type { Message } from "discord.js";
import { injectable } from "tsyringe";
import { checkuserperms } from "../../utils/functions/permissions/checkuserperms.js";
import { UpdateTrackTime } from "../../structures/db_managing/setting_tracktime.js";
import ms from "ms";
import ctx from "../../utils/util/ctx.js";
@injectable()
export default class implements Command {
  public name = "maxtime";
  public alias = [];
  public permissions = {
    userpermissions: `Administrator`,
  };
  public description = ` \`Usage:\` **-maxtime [duration]** \nTo set the max track duration otherwise won't be loaded to the queue.\n\`Default duration is 1h.\`\n\nExamples:\n\`-tracktime 30m\`\n\`-tracktime 2h\`\n\npermissions: 
    \`user:\` ${this.permissions.userpermissions}
  `;
  constructor() {}
  public async execute(message: Message, args: [number]): Promise<unknown> {
    if (!checkuserperms(message, "ADMINISTRATOR")) return;
      if (!args[0]) {
        return message.channel.send({
          embeds: 
          [
            { 
              description: this.description, color: `AQUA` 
            }
          ],
        });
      }
      const duration = ms(args[0]);
        if (
          parseInt(duration) < 60000 
          || !ms(args[0]) 
            ||parseInt(duration) >= 10800000 
              || !isNaN(args[0])
        )
          return;
            await UpdateTrackTime(message, duration);
              ctx({
                key: 'settings.trackTime',
                options: {
                  Time: args[0]
                }
              }, message, 'AQUA')
  }
}
