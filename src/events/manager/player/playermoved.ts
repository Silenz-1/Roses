import { Client } from "discord.js";
import { Manager, Player } from "erela.js";
import { injectable } from "tsyringe";
import type { Event } from "../../../config/Events";
@injectable()
export default class implements Event {
  public name = "PlayerMoved Event";

  constructor(public client: Client, public manager: Manager) {}

  public async execute(): Promise<void> {
    const resolve = async (player: Player) => {
      const resolving = new Promise(res => setTimeout(res, 1000));
       player.pause(true);
       await resolving;
      player.pause(false);
    }

    this.manager.on("playerMove", async (player, _oldChannel, newChannel) => {
      if (!newChannel) 
        return player.destroy();

          if (newChannel) {
            player.setVoiceChannel(newChannel);
            await resolve(player)
          }
            
    });
  }
}
