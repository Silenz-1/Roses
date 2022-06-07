import type { Command } from "../../config/Commands";
import type { Message } from "discord.js";
import { injectable } from "tsyringe";
import { checkuserperms } from "../../utils/functions/permissions/checkuserperms.js";
import { UpdateAnnounce } from "../../structures/db_managing/setting_announce.js";
import ctx from "../../utils/util/ctx.js";
@injectable()
export default class implements Command {
  public name = "announce";
  public alias = [];
  public permissions = {
    userpermissions: `Administrator`,
  };
  public description = `       
        \`Usage:\` **-announce <true|false>**\n\nTo whether disable/enable announcing the start of a track in the guild.\n\npermissions:\n \`user:\` ${this.permissions.userpermissions}
    `;
  constructor() {}
  public async execute(message: Message<boolean>, args: string[]): Promise<unknown> {
    if (!checkuserperms(message, ["ADMINISTRATOR"])) return;
    if (args.length === 0) {
      return message.channel.send({
        embeds: [
          {
            description: this.description,
            color: `AQUA`,
          },
        ],
      });
    }
    if (args[0] !== "true" && args[0] !== "false") return;

    
    await UpdateAnnounce(message, args[0]);
    ctx({
      key: 'settings.announce',
      options: {
        value: args[0]
      }
    }, message, 'AQUA')
  }
}
