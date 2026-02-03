import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, GuildMember,  InteractionReplyOptions, OAuth2Guild, StringSelectMenuBuilder } from "discord.js";

export function moveMemberMenu(guilds: OAuth2Guild[], page: number, member?: GuildMember) {

    const maxItems = 9
    const amount = guilds.length
    const total = Math.ceil(amount / maxItems)
    const spliced = guilds.splice(page * maxItems, maxItems)

    const embed = createEmbed({
        color: settings.colors.default,
        thumbnail: member?.displayAvatarURL(),
        description: brBuilder(
            member ? ` ## ${icon.adicionar} Adicionar membero` : ` ## ${icon.dados_moveis} Mover todos membros`,
            member && `> ${member.roles.highest} ${member} **@${member.user.username}**`,
            member ?
                "- Selecione abaixo os servidores que deseja adicionar o membro"
                :
                "- Selecione abaixo o servidor que deseja mover os membros"
        )
    })
    const prefix = member ?
        `manage/members/add/${member.id}` :
        `manage/members/move`


    const components = [
        createRow(
            new StringSelectMenuBuilder({
                customId: `${prefix}/${page}`,
                placeholder:`Selecione ${member ?"os servidores" :"o servidor"}`,
                options:spliced.map(guild=>({
                    label:guild.name,
                    value:guild.id
                })),
                max_values: member? spliced.length : 1,

            }

            )
        ),
        createRow(
            new ButtonBuilder({
                customId:`${prefix}/${page -1}`,
                emoji:icon.seta_esquerda,
                disabled:page === 0,
                style:ButtonStyle.Secondary
            }),
            new ButtonBuilder({
                customId:`${prefix}/00`,
                emoji:icon.cardapio,
                disabled:page === 0,
                style:ButtonStyle.Secondary
            }),
            new ButtonBuilder({
                customId:`${prefix}/${page +1}`,
                 emoji:icon.setadireita ,
                disabled:page >= total -1,
                style:ButtonStyle.Secondary
            }),
           
        )
    ]
    return { embeds:[embed] , components} satisfies InteractionReplyOptions
}