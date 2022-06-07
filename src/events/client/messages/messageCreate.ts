import { Constants, Client } from "discord.js";
import { Manager } from "erela.js";
import type { Event } from "../../../config/Events.js";
import { injectable, inject } from "tsyringe";
import type { Command } from "../../../config/Commands.js";
import { InjCommands } from "../../../symbols.js";
import { channelperms } from "../../../utils/functions/permissions/botperms.js";
import { GetPrefix } from "../../../structures/db_managing/setting_prefix.js";
@injectable()
export default class implements Event {
  public name = "messageCreate Event";

  public event = Constants.Events.MESSAGE_CREATE;

  constructor(
    public client: Client,
    public manager: Manager,
    @inject(InjCommands) public commands: Map<string, Command>
  ) {}
  public async execute() {
    this.client.on(this.event, async (message) => {
      try {
        const GuildsPrefix = await GetPrefix(message.guildId);
        if (message.author.bot) return;
        if (!message.content.startsWith(GuildsPrefix)) return;
        const [commandName, ...RestOfArgs] = message.content
          .trim()
          .substring(GuildsPrefix.length)
          .split(/\s+/);
        const command = this.commands.get(commandName);
        if (!channelperms(message)) return;
        else {
          if (command) {
            command.execute(message, RestOfArgs, this.manager);
          }
        }
      } catch (e) {
        message.channel.send(
          "An issue occured while trying to execute the command."
        );
          console.log(e);
      }
    });
  }
}
