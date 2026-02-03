import { RESTGetAPIGuildMemberResult, RouteBases } from "discord.js";
import { FecthResult } from "#settings";

type FetchMemberResult = FecthResult<RESTGetAPIGuildMemberResult>

export async function fetchMemberInfo(guildId: string, accessToken: string): Promise<FetchMemberResult> {
    const response = await fetch(`${RouteBases.api}/users/@me/guilds/${guildId}/member`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) return {
        success: false,
        error: response.statusText,
        status: response.status
    }
    
    const data = await response.json() as RESTGetAPIGuildMemberResult;
    return {
        success: true,
        data
    }
}
