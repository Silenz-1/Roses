import { Client } from 'discord.js';
import { Manager } from 'erela.js';
import { injectable } from 'tsyringe';
import type { Event } from '../../../config/Events';
@injectable()
export default class implements Event {
  public name = 'NodeConnect Event';

  constructor(public client: Client, public manager: Manager) {}

  public async execute(): Promise<void> {
    this.manager.on('nodeConnect', (node) => {
      console.log(`Node ${node.options.identifier} connected`);
    });
  }
}
