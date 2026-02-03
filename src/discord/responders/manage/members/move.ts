import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { getInvitableGuilds, icon, res } from '#functions';
import { menus } from '#menus';
import { sleep } from '@magicyan/discord';

import { GuildMember, userMention } from 'discord.js';
import { z } from 'zod'
const schema = z.object({
    page: z.coerce.number(),


});

const customId = "manage/members/move/:page"
createResponder({
    customId,
    parse: params => schema.parse(params),
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { page }) {

        const { client } = interaction
        await interaction.deferUpdate();

        const guilds = await getInvitableGuilds(client)

        interaction.editReply(menus.manage.members.move(guilds, page))

    }
}

)

createResponder({
    customId,
    parse: params => schema.parse(params),
    types: [ResponderType.StringSelect], cache: "cached",
    async run(interaction) {

        const { client, values: [guildId] } = interaction
        interaction.update(res.default("Aguarde um instante..."))


        const documents = await db.users.find({
            "auth.token": { $exists: true }
        })


        const guild = await client.guilds.fetch(guildId)
        console.log(guild)

        for (const userDocument of documents) {
            const token = await userDocument.getAcessToken();
            if (!token) {
                interaction.editReply(res.default(`${icon.macos_close} ${userMention(userDocument.id)} Revogou a autorização.`))
                continue;
            }




            const existing = await guild.members.fetch(userDocument.id).catch(() => null)
            if (existing) {
                console.log(`${userDocument.id} já está na guilda ${guild.name}`);
                continue;
            }
           
            const onSucess = (member: GuildMember) => interaction.channel?.send(res.default(`${member} foi adicionado com sucesso á guilda **${guild.name}**`))


            await guild.members.add(userDocument.id, { accessToken: token }).
                then(onSucess)
                .catch(async (err) => {
                    const token = await userDocument.getAcessToken(true);
                    if (!token) return err
                    await guild.members.add(userDocument.id, { accessToken: token }).
                        then(onSucess)
                })
                .catch(() => interaction.channel?.send(res.default(`Não foi possível adicionar ${userMention(userDocument.id)} na guilda **${guild.name}**`)))
            await sleep(1000)

        }
        interaction.channel?.send(res.default(`Processo concluído!`))




    }




}


)