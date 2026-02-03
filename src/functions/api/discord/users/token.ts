import { FecthResult } from "#settings";
import { RESTPostOAuth2AccessTokenResult, RouteBases } from "discord.js";

type TokenExchangeResult = FecthResult<RESTPostOAuth2AccessTokenResult>;
export async function userAcessToken(code: string): Promise<TokenExchangeResult>
export async function userAcessToken(refreshToken: string, refresh: true): Promise<TokenExchangeResult>
export async function userAcessToken(argA: string, refresh: boolean = false): Promise<TokenExchangeResult> {

   
    const clientInfo = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    }
    const fetchBody = refresh ?
        {
            grant_type: "refresh_token", refresh_token: argA
        } : {
            code: argA,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.SERVER_BASE_URL}/auth/redirect`
        }
    const body: {} = Object.assign(clientInfo, fetchBody)
 
    
    const response = await fetch(`${RouteBases.api}/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(body).toString()
    });
    
 
    
    const data = await response.json() as RESTPostOAuth2AccessTokenResult;
 
    if (!response.ok) {
      
        return {
            success: false,
            error: response.statusText,
            status: response.status
        }
    }
    
  
    return {
        success: true,
        data
    }
}