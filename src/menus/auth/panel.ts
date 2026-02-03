import { settings } from "#settings";
import { brBuilder, createContainer, createLinkButton, createThumbArea, Separator } from "@magicyan/discord";
import {   Guild, InteractionReplyOptions, OAuth2Scopes } from "discord.js";
import { icon } from "functions/utils/emojis.js";

export function authPanelMenu<R>(guild: Guild,url:string): R {

   

    const container = createContainer(
        settings.colors.cpx,
        createThumbArea({
            content: brBuilder(
                `# ${icon.logo} Verificação ${guild.name}`,
                `Seja bem-vindo(a) ao ${guild.name}! Para garantir a segurança da nossa comunidade, será necessário passar por um captcha antes de acessar o servidor. Para iniciar clique no botão abaixo`           
            ),
            thumbnail: guild.iconURL()

        }),
        Separator.Default,
     
        createLinkButton({
            label: "Verificar",
            url,
            emoji:icon.check
        })

    )

    return ({
        flags: ["IsComponentsV2"],
        components: [container]
    } satisfies InteractionReplyOptions) as R
}

