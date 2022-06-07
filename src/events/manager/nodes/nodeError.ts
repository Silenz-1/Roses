import { Client } from "discord.js";
import { Manager } from "erela.js";
import { injectable } from "tsyringe";
import type { Event } from "../../../config/Events.js";
@injectable()
export default class implements Event {
  public name = "NodeError Event";

  constructor(public client: Client, public manager: Manager, ) {}

  public async execute(): Promise<void> {
    this.manager.on("nodeError", (node, error) => {
        console.log(`Node ${node.options.identifier} had an error: ${error.message}`)
    });
  }
}
