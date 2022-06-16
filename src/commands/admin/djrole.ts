import type { Command } from "../../config/Commands";
import type { Message, Snowflake } from "discord.js";
import { injectable } from "tsyringe";
import { checkuserperms } from "../../utils/functions/permissions/checkuserperms";
import { GetDjrole, UpdateDjrole } from "../../structures/db_managing/setting_djrole";
import ctx from "../../utils/ctx.js";
@injectable()
export default class implements Command {
  public name = "DJRole";
  public alias = ["dj"];
  public permissions = {
    userpermissions: `Administrator`
  }
  public description = `To set a new DJ role in the guild. Only accepts role ID.`;
  constructor() {}
  public async execute(message: Message, args: [Snowflake]): Promise<unknown> {
    if (!checkuserperms(message, ["ADMINISTRATOR"])) return;

    const role = message.guild?.roles.cache.get(args[0]);

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

    if (!role) return;

    if (role.name === await GetDjrole(message.guildId)) {
      return ctx(
        {
          key: 'settings.djrole.exists',
          options: {
            role: role.name
          }
        }, 
        message, 
        "YELLOW"
      )
    }

    await UpdateDjrole(message, role.name);
    ctx(
      {
        key: 'settings.djrole.set_djrole',
        options: {
          role: role.name
        }
      }, 
      message, 
      'AQUA'
    )
    
  }
}
