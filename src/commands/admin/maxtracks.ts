import type { Command } from "../../config/Commands";
import type { Message } from "discord.js";
import { injectable } from "tsyringe";
import { checkuserperms } from "../../utils/functions/permissions/checkuserperms";
import { UpdateMaxqueue } from "../../structures/db_managing/setting_maxqueue";
import ctx from "../../utils/util/ctx.js";
@injectable()
export default class implements Command {
  public name = "maxtracks";
  public alias = [];
  public permissions = {
    userpermissions: `Administrator`,
  };
  public description = `To set the max number of tracks can be add to the queue.`;
  constructor() {}
  public async execute(message: Message, args: [number]): Promise<unknown> {
    if (!checkuserperms(message, "ADMINISTRATOR")) return;

      if (!args[0]) {
        return message.channel.send({
          embeds: [{ description: this.description, color: `AQUA` }],
        });
      }
  
        if (args[0] > 400 || args[0] <= 1 || isNaN(args[0]) === true) return;

            await UpdateMaxqueue(message, args[0]);

                ctx(
                  {
                    key: 'settings.maxQueue',
                    options: {
                      num: args[0]
                    }
                  },
                  message, 
                  'AQUA'
                )
  }   
}
