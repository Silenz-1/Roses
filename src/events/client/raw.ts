import { Constants, Client } from "discord.js";
import { Manager } from "erela.js";
import { injectable } from "tsyringe";
import type { Event } from "../../config/Events.js";
@injectable()
export default class implements Event {
  public name = "Raw Event";
  public event = Constants.Events.RAW;

  constructor(public client: Client, public manager: Manager) {}

  public async execute(): Promise<void> {
    this.client.on(this.event, (d) => {
      this.manager.updateVoiceState(d);
    });
  }
}
