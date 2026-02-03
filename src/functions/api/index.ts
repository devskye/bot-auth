import { createAuthorizationURL } from "./discord/users/authorize.js";
import { fetchUserInfo } from "./discord/users/info.js";
import { userAcessToken } from "./discord/users/token.js";
import { fetchUserGuilds } from "./discord/users/guilds.js";
import { fetchMemberInfo } from "./discord/users/member.js";

export const API={
    discord:{
        users:{
            tokenExchange:userAcessToken,
            fetchInfo:fetchUserInfo,
            createAuthorizationURL:createAuthorizationURL,
            fetchGuilds:fetchUserGuilds,
            fetchMember:fetchMemberInfo
        }
    }
}