import { Constants, Client } from "discord.js";
import { Manager } from "erela.js";
import { injectable } from "tsyringe";
import type { Event } from "../../../config/Events.js";

@injectable()
export default class implements Event {
  public name = "Ready Event";
  public event = Constants.Events.CLIENT_READY;

  constructor(public client: Client, public manager: Manager) {}

  public async execute(): Promise<void> {
    this.client.once(this.event, () => {
      console.log(`${this.client?.user?.username} is ready`);
      this.manager.init(this.client?.user?.id);
    });
  }
}