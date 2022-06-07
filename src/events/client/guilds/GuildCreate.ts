import { Constants, Client } from "discord.js";
import { Manager } from "erela.js";
import type { Event } from "../../../config/Events.js";
import { injectable } from "tsyringe";
import { connection } from "../../../structures/db/connection.js";
@injectable()
export default class implements Event {
  public name = "GuildCreate Event";
  public event = Constants.Events.GUILD_CREATE;
  constructor(public client: Client, public manager: Manager) {}

  public async execute(): Promise<void> {
    this.client.on(this.event, async (guild) => {
        connection.query(
        `INSERT INTO Guilds(GuildID) VALUES('${guild.id}');`
      );
    });
  }
}
