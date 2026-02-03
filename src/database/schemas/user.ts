import { API } from "#functions";
import { t } from "../utils.js";
import { RESTPostAPIApplicationCommandsResult, RESTPostOAuth2AccessTokenResult, RESTPostOAuth2TokenRevocationQuery } from "discord.js";
import { HydratedDocument, Model, Schema } from "mongoose";
import { throwDeprecation } from "process";

export interface UserSchema {
    id: string;
    ip?: string;
    auth?: {
        token?: {
            access: string;
            refresh: string;
            type: string;
            expires: Date;
        }
    }

}

export type HydratedUserDocuument = HydratedDocument<UserSchema, UserMethods>;
type DocumentReturn = HydratedUserDocuument;

interface UserStatics {
    get(id: string): Promise<DocumentReturn>;
}

interface UserMethods {
    setAuth(tokenData: RESTPostOAuth2AccessTokenResult): Promise<DocumentReturn>;
    getAcessToken(refresh?: boolean): Promise<string | null>;
}

type UserModel = Model<UserSchema, {}, UserMethods>;

export const userSchema = new Schema<UserSchema, UserModel, UserMethods, {}, {}, UserStatics>(
    {
        id: t.string,
        ip: { type: String, required: false },
        auth: {
            token: new Schema({
                access: t.string,
                refresh: t.string,
                type: t.string,
                expires: t.date
            }, { _id: false })
        }
    },
    {
        statics: {
            async get(id) {
                const document = await this.findOne({ id }) ?? await this.create({ id });
                return document as DocumentReturn;
            }
        },
        methods: {
            async setAuth(tokenData) {
                const expiresAt = new Date();
                expiresAt.setSeconds(
                    expiresAt.getSeconds() + tokenData.expires_in
                );
                return await this.$set("auth.token", {
                    access: tokenData.access_token,
                    refresh: tokenData.refresh_token,
                    type: tokenData.token_type,
                    expires: expiresAt
                }).save();
            },
            async getAcessToken(refresh?: boolean): Promise<string | null>{
             if(!this.auth?.token) return null;

                if(refresh ){
                    const result = await API.discord.users.tokenExchange(
                        this.auth.token.refresh,true
                    );
                    if(!result.success) return null;
                    await this.setAuth(result.data);
                    return this.getAcessToken();

                }
                
                return this.auth.token.access;
            }

        }
    }
    
)