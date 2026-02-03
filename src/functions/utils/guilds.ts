import type {Client} from "discord.js"

export async function getInvitableGuilds(client:Client<true>) {
    const guilds = await client.guilds.fetch()

    return Array.from(guilds.filter(g => g.permissions.has("CreateInstantInvite"))
    .values()

    )
}