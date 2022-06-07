import type { GuildMember, Message, Snowflake } from "discord.js";
import type { FieldPacket } from "mysql2";
import { connection } from "../db/connection.js";
export async function UpdateDjrole(
  message: Message,
  role: string
): Promise<[any, FieldPacket[]]> {
  return connection.execute(
    `
      UPDATE Guilds SET DJROLE = '${role}' WHERE GuildId = '${message.guildId}';
    `
  );
}

export async function CheckDjrole(message: Message): Promise<boolean> {
  const [GETDJROLE]: any = await connection.execute(
    `
      SELECT DJROLE FROM GUILDS WHERE GUILDID = '${message.guildId}'
    `
  );

  const getrole = (message.member as GuildMember).roles.cache.filter((role) => {
    return role.name === GETDJROLE[0].DJROLE;
  });
  
  if (getrole.size === 0) {
    message.channel.send({
      embeds: [
        {
          description: `You don't have the \`${GETDJROLE[0].DJROLE}\` role.`,
          color: 'RED'
        },
      ],
    });
    return false;
  }
  return true;
}

export async function GetDjrole(Id: Snowflake | null): Promise<string> {
  
  const [GETDJROLE]: any = await connection.execute(
    `
      SELECT DJROLE FROM GUILDS WHERE GUILDID = '${Id}'
    `
  );

  return GETDJROLE[0].DJROLE;
}
