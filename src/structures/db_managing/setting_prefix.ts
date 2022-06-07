import type { Message, Snowflake } from "discord.js";
import type { FieldPacket } from "mysql2";
import { connection } from "../db/connection.js";

export async function UpdatePrefix(message: Message, prefix: string): Promise<[any, FieldPacket[]]> {
  return connection.execute(
    `
      UPDATE Guilds SET Prefix = '\\${prefix}' WHERE GuildId = '${message.guildId}';
    `
  );
}

export async function GetPrefix(Id: Snowflake | null): Promise<string> {
  
  const [GETPREFIX]: any = await connection.execute(
    `
     SELECT Prefix From Guilds WHERE GuildId = '${Id}'
    `
  );
  return GETPREFIX[0].Prefix;
}
