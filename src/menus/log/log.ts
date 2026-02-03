
import { settings } from "#settings";
import { Separator, brBuilder, createContainer, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, InteractionReplyOptions, spoiler } from "discord.js";
import { icon } from "../../functions/utils/emojis.js";
import { time } from "discord.js";


interface LogInfo {
    status: boolean;
    ip: string;
    user: string;
    userID: string;
    email: string;
    provedor: string;
    fingerUserID: string;
    fingerGpuVendor: string;
    fingerGpuRenderer: string;
    date: string;
}

export function log<R>( LogInfo: LogInfo): R {
    const container = createContainer(
        settings.colors.default,
        brBuilder(
            `# ${LogInfo.status ? icon.check : icon.close} ${LogInfo.status ? "Autenticação bem-sucedida" : "Tentativa de autenticação VPN ou IP Bloqueado"}`,
            "",
            `- **Usuário:** <@${LogInfo.userID}>`,
            `- **ID do usuário:** ${LogInfo.userID}`,
            `- **IP:** ${spoiler(LogInfo.ip)}`,
            `- **Email:** ${LogInfo.email}`,
            `- **Provedor:** ${LogInfo.provedor}`,
            `- **UserID:** ${LogInfo.fingerUserID}`,
            `- **GPU Vendor:** ${LogInfo.fingerGpuVendor}`,
            `- **GPU Renderer:** ${LogInfo.fingerGpuRenderer}`,
            `- **Data:** ${time(new Date(LogInfo.date), "f")}`,
            
        ), 
        Separator.Default,
        createRow(
            new ButtonBuilder({
                label: "Mensagem automática do sistema",
                emoji: icon.logo,
                style: ButtonStyle.Secondary,
                customId: "message_automated",
                disabled: true,
            })
        )
    );

    return ({
        flags: ["IsComponentsV2"],
        components: [container]
    } satisfies InteractionReplyOptions) as R;
}

