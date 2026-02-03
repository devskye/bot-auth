import { APIUser, RouteBases } from "discord.js";
import { FecthResult } from "#settings";
type FetchUserInfoResult = FecthResult<APIUser>

export async function fetchUserInfo(accessToken:string):Promise<FetchUserInfoResult>{
    const response = await fetch(`${RouteBases.api}/users/@me`,{
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    if(!response.ok) return {
        success: false,
        error: response.statusText,
        status: response.status
    }
    const data = await response.json() as APIUser;
    return {
        success: true,
        data
    }
}