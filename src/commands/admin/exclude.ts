import type { Command } from "../../config/Commands";
import type { Message } from "discord.js";
import { injectable } from "tsyringe";
import { checkuserperms } from "../../utils/functions/permissions/checkuserperms";
import { PushingExcludes } from "../../structures/db_managing/setting_Excludes";
import { GetExcludes } from "../../structures/db_managing/setting_Excludes";
import { RemoveExcludes } from "../../structures/db_managing/setting_Excludes";
import ctx from "../../utils/util/ctx.js";
@injectable()
export default class implements Command {
  public name = "exclude";
  public alias = ["ex"];
  public permissions = {
    userpermissions: `Administrator`,
  };
  public description = `To exclude a command from being only executable for the memebers who have DJ role.`;
  constructor() {}
  public async execute(
    message: Message,
    args: [string, string]
  ): Promise<unknown> {
    if (!checkuserperms(message, ["ADMINISTRATOR"])) return;

    if (!args[0]) {
        message.channel.send({
            embeds: [
                {
                    description: this.description,
                    color: 'AQUA'
                }
            ]
        })
    }

    const Avaliablecmds_ = [
      "pause",
      "remove",
      "clear",
      "disconnect",
      "loop",
      "skip",
      "replay",
      "shuffle",
      "resume",
      "queuerepeat",
    ];

    const Excludescmds_ = await GetExcludes(message.guildId);

    if (args[0] === "list") {
      if (!Excludescmds_.length) {
        return ctx({
            key: 'exclude.list.no_excluded_commands'
        }, message, 'YELLOW')
      }
        ctx(
          {
            key: 'exclude.list.display_list',
            options: {
                guildName: message.guild?.name,
                excludedCommands: Excludescmds_.join('\n')
            }
          }, 
          message, 
          'AQUA'
        )
    }

    if (!Avaliablecmds_.includes(args[1])) return;

    if (args[0] === "add") {
        if (Excludescmds_.includes(args[1])) {
            return ctx(
              {
                key: "errors.commands.excludes.excluded",
                options: {
                  cmd: args[1],
                },
              },
              message,
              "YELLOW"
            );
        }

        await PushingExcludes(message.guildId, args[1]);
        ctx(
            {
                key: "exclude.add_exclude",
                options: {
                cmd: args[1],
                },
            },
            message,
            "AQUA"
        );
    }

    if (args[0] === "remove") {
      if (Excludescmds_.includes(args[1])) {
        await RemoveExcludes(message.guildId, args[1]);
            return ctx(
                {
                    key: "exclude.remove_excluded",
                    options: {
                        cmd: args[1],
                    },
                },
                message,
                "AQUA"
            );
      }

        ctx(
            {
                key: "errors.commands.excludes.not_excluded",
                options: {
                    cmd: args[1],
                }
            }, 
            message, 
            "YELLOW"
        );
    }
  }
} 
