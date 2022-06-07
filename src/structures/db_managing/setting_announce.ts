import type { Message, Snowflake } from "discord.js";
import { connection } from "../db/connection.js";
import type { FieldPacket } from "mysql2";
export async function UpdateAnnounce(message: Message, value: string ): Promise<[any, FieldPacket[]]> {

    return connection.execute(
        `
          UPDATE Guilds SET Announce = '${value}' WHERE GuildId = '${message.guildId}'
        `
    )
}


export async function GetAnnounce(Id: Snowflake | null): Promise<string> {

    const [GETANNOUNCE]: any =  await connection.execute(
        `
         SELECT Announce FROM GUILDS WHERE GuildId = '${Id}';
        `
    );
    return GETANNOUNCE[0].Announce;
}