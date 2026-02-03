import { RESTGetAPICurrentUserGuildsResult, RouteBases } from "discord.js";
import { FecthResult } from "#settings";

type FetchUserGuildsResult = FecthResult<RESTGetAPICurrentUserGuildsResult>

export async function fetchUserGuilds(accessToken: string): Promise<FetchUserGuildsResult> {
    const response = await fetch(`${RouteBases.api}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) return {
        success: false,
        error: response.statusText,
        status: response.status
    }
    
    const data = await response.json() as RESTGetAPICurrentUserGuildsResult;
    return {
        success: true,
        data
    }
}
