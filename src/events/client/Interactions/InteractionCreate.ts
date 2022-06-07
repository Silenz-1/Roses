import { Constants, Client } from "discord.js";
import { Manager } from "erela.js";
import type { Event } from "../../../config/Events.js";
import { injectable } from "tsyringe";
@injectable()
export default class implements Event {
  public name = "InteractionCreate Event";
  public event = Constants.Events.INTERACTION_CREATE;
  constructor(public client: Client, public manager: Manager) {}

  public async execute(): Promise<void> {
    this.client.on(this.event, async (interaction) => {
      if (!interaction.isButton()) return;
        if (!interaction.isSelectMenu()) return;
    });
  }
}
