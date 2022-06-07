import { Client, TextChannel } from "discord.js";
import { Manager } from "erela.js";
import { injectable } from "tsyringe";
import type { Event } from "../../../config/Events.js";
@injectable()
export default class implements Event {
  public name = "QueueEnd event";

  constructor(public manager: Manager, public client: Client) {}

  public async execute(): Promise<void> {
    this.manager.on("queueEnd", (player) => {
      if (!player.textChannel) return;

      const channel = this.client.channels.cache.get(player.textChannel) as TextChannel;
      
      channel.send(
        { 
          embeds: [
              {
                description: `Queue has ended.`, 
                color: `AQUA`
              }
          ] 
        });
        player.destroy();
    });
  }
}