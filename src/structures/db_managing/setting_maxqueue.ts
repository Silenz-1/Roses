import type { Message, Snowflake } from "discord.js";
import type { FieldPacket } from "mysql2";
import { connection } from "../db/connection.js";

export async function UpdateMaxqueue(message: Message, num: number): Promise<[any, FieldPacket[]]> {

    return connection.execute(
        `   
            UPDATE Guilds SET MAXQEUEU = ${num} WHERE GUILDID = '${message.guildId}'     
        `
    )
}


export async function GetMaxqueue(Id: Snowflake | null): Promise<number> {
    const [GETMAXQUEUE]: any = await connection.execute(
        `   
            SELECT MAXQEUEU FROM GUILDS WHERE GUILDID = '${Id}'
        `
    )
    return GETMAXQUEUE[0].MAXQEUEU;
}