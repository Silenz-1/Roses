import type { Command } from "../../config/Commands";
import type { Message } from "discord.js";
import { injectable } from "tsyringe";
import { UpdatePrefix } from "../../structures/db_managing/setting_prefix.js";
import { checkuserperms } from "../../utils/functions/permissions/checkuserperms.js";
import ctx from "../../utils/util/ctx.js";
@injectable()
export default class implements Command {
  public name = "prefix";
  public alias = ["setprefix"];
  public permissions = {
    userpermissions: `Administrator`
  }
  public description = 
  `
    \`Usage:\` **-prefix [prefix]**\n\nTo setup a new prefix in this guild.\n
    permissions: 
    \`user:\` ${this.permissions.userpermissions}
  `;
  constructor() {}
  public async execute(message: Message, args: [string]): Promise<unknown> {
    if (!checkuserperms(message, "ADMINISTRATOR")) return;

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          {
            description: this.description,
            color: "AQUA",
          },
        ],
      });
    }

    if (args[0].length > 5) return;

    await UpdatePrefix(message, args[0]);

    ctx(
      {
        key: 'settings.newPrefix',
        options: {
          new_prefix: args[0]
        }
      }, 
      message, 
      "AQUA"
    )
  }
}
