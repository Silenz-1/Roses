import type { Message, Snowflake } from "discord.js";
import type { FieldPacket } from "mysql2";
import { connection } from "../db/connection.js";

export async function UpdateTrackTime(message: Message, num: string): Promise<[any, FieldPacket[]]> {

    return connection.execute(
        `   
            UPDATE Guilds SET TrackTime = ${num} WHERE GUILDID = '${message.guildId}'     
        `
    )
}


export async function GetTrackTime(Id: Snowflake | null): Promise<number> {
    const [GETMAXTRACKTIME]: any = await connection.execute(
        `   
            SELECT TrackTime FROM GUILDS WHERE GUILDID = '${Id}'
        `
    )
        return GETMAXTRACKTIME[0].TrackTime;
}