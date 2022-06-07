import { Client, TextChannel } from "discord.js";
import { Manager } from "erela.js";
import { injectable } from "tsyringe";
import type { Event } from "../../../config/Events.js";
import { GetAnnounce } from "../../../structures/db_managing/setting_announce.js";
import { formates } from "../../../utils/functions/formates.js";
@injectable()
export default class implements Event {
  public name = "TrackStart Event";

  constructor(public client: Client, public manager: Manager, ) {}

  public async execute(): Promise<void> {
    const { player: { TrackStartEmbed_f2 } } = formates;
    this.manager.on("trackStart", async (player, track) => {
      if (!player.textChannel) return;
        
      const channel = (this.client.channels.cache.get(player.textChannel)) as TextChannel;

        if (await GetAnnounce(player.guild) === 'false') return;

          await TrackStartEmbed_f2(channel, track);
      
    });
  }
}
