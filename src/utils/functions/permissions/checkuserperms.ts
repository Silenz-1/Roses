import type { Message, PermissionResolvable } from "discord.js";

export function checkuserperms(message: Message, userperms: PermissionResolvable): boolean {
  let memberperms = message.member?.permissions.has(userperms);

  if (!memberperms) {
    return false;
  }
  return true;
}

