import { connection } from "../db/connection.js";
import type { Snowflake } from "discord.js";
import type { FieldPacket } from "mysql2";


export async function PushingExcludes(Id: Snowflake | null, command: string): Promise<[any, FieldPacket[]]> {
    return connection.execute(

        `   
            UPDATE GUILDS SET EXCLUDES = COALESCE(JSON_ARRAY_APPEND(EXCLUDES, '$', "${command}"), JSON_ARRAY("${command}")) WHERE GuildId = '${Id}';
        `
    )
}


export async function RemoveExcludes(Id: Snowflake | null, command: string): Promise<[any, FieldPacket[]]> {
    return connection.query(

        `   
            SET @EXCLUDES = (SELECT EXCLUDES FROM Guilds WHERE GuildId = '${Id}'); 
            SET @PURGE = JSON_SEARCH(@EXCLUDES, "one", "${command}");
            UPDATE Guilds SET EXCLUDES = JSON_REMOVE(EXCLUDES, JSON_UNQUOTE(@PURGE)) WHERE GUildId = '${Id}';
        `
    )
}

export async function GetExcludes(Id: Snowflake | null): Promise<string[]> {

    const [EXCLUDES]: any = await connection.execute(
        `   
            SELECT Excludes FROM GUILDS WHERE GUILDID = '${Id}'
        `
    )
    return EXCLUDES[0].Excludes;
    
}