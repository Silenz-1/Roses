import type { Message } from "discord.js";
export function CheckOwner(message: Message, owner: boolean): boolean {
  if (owner) {
    if (message.author.id !== "467196478524358666") return false;
  }
  return true;
}
