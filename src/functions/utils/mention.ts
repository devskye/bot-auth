import { channelMention } from "discord.js";

export function formatedChannelMetion(id:string|null|undefined,alt=""){
return id ? channelMention(id) : alt;
}