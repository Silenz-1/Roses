import type { Command } from "../config/Commands";
import type { Message } from "discord.js";
import { injectable, inject } from "tsyringe";
import { InjCommands } from "../symbols.js";
@injectable()
export default class implements Command {
  public name = "help";
  public alias = ["h"];
  public description = `To diplay rose's help menu.\n\n\`aliases:\` **${this.alias}**`;
  constructor(@inject(InjCommands) public commands: Map<string, Command>) {}
  public async execute(message: Message, args: [string]): Promise<unknown> {
    if (!args[0]) return;

    const GetCmd = this.commands.get(args[0]);

    if (GetCmd) {
      message.channel.send({
        embeds: [
          {
            description: `${GetCmd.description}`,
            color: `AQUA`,
          },
        ],
      });
    }
  }
}
