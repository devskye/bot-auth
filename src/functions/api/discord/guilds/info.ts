import { RESTGetAPIGuildResult, RouteBases } from "discord.js";
import { FecthResult } from "#settings";

type FetchGuildInfoResult = FecthResult<RESTGetAPIGuildResult>

export async function fetchGuildInfo(guildId: string): Promise<FetchGuildInfoResult> {
    const response = await fetch(`${RouteBases.api}/guilds/${guildId}`, {
        headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`
        }
    });
    
    if (!response.ok) return {
        success: false,
        error: response.statusText,
        status: response.status
    }
    
    const data = await response.json() as RESTGetAPIGuildResult;
    return {
        success: true,
        data
    }
}
