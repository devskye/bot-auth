import { createResponder, ResponderType } from '#base';
import { db } from '#database';
import { getInvitableGuilds, icon, res } from '#functions';
import { menus } from '#menus';
import { brBuilder, sleep } from '@magicyan/discord';
import { error } from 'console';
import { GuildMember, userMention } from 'discord.js';
import { z } from 'zod'
const schema = z.object({
    mentionId: z.string(),
    page: z.coerce.number(),


});

const customId = "manage/members/add/:mentionId/:page"
createResponder({
    customId,
    parse: params => schema.parse(params),
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { mentionId, page }) {

        const { client, guild } = interaction
        await interaction.deferUpdate();
        const mention = guild.members.cache.get(mentionId)!
        const guilds = await getInvitableGuilds(client)

        interaction.editReply(menus.manage.members.move(guilds, page, mention))

    }
}

)
createResponder({
    customId,
    parse: params => schema.parse(params),
    types: [ResponderType.StringSelect], cache: "cached",
    async run(interaction, { mentionId }) {

        const { client, values } = interaction
        interaction.update(res.default("Aguarde um instante..."))

        const guilds = client.guilds.cache.filter(q => values.includes(q.id))
        const mentionData = await db.users.get(mentionId)
        const token = await mentionData.getAcessToken()
        if (!token) {
            interaction.editReply(res.default(`${icon.macos_close} Este usuário não autorizou o bot.`))
            return;
        }
        const result: string[] = []
        for (const guild of guilds.values()) {
            const onSucess = (member: GuildMember) => result.push(`${member} foi adicionado com sucesso á guilda **${guild.name}**`)

            await guild.members.add(mentionId, { accessToken: token }).
                then(onSucess)
                .catch(async (err) => {
                    const token = await mentionData.getAcessToken(true);
                    if (!token) return err
                    await guild.members.add(mentionId, { accessToken: token }).
                        then(onSucess)
                })
                .catch(()=> result.push(res.default(`Não foi possível adicionar ${userMention(mentionId) } na guilda **${guild.name}**`)))
                await sleep(1000)

        }
     
       interaction.channel?.send(res.default(brBuilder(result)))
        return;


    }
}

)