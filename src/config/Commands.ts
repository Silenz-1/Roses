import type { Message } from "discord.js";
import type { Manager } from "erela.js";
import { basename } from "node:path";

export interface Command {
  name: string;
  alias: string[];
  permissions?: {
    userpermissions: string;
  };
  description?: string;
  execute(message: Message, args: unknown, manager: Manager): Promise<unknown>;
}

export interface commandinfo {
  commandName: string;
}

export function commandInfo(path: string): commandinfo {
  return { commandName: basename(path, ".js") };
}
