import { settings } from "#settings";
import type { Client, TextChannel } from "discord.js";
import { log } from "menus/log/log.js";

/**
 * Envia log de autenticação para o canal configurado
 * @param client - Cliente do Discord
 * @param logData - Dados do log
 * @returns Promise<boolean> - true se enviado com sucesso
 */
export async function sendAuthLog(
    client: Client, 
    logData: {
        status: boolean;
        ip: string;
        user: string;
        userID: string;
        date: string;
    }
): Promise<boolean> {
    try {
        const channel = client.channels.cache.get(settings.channels.log);
        
        if (!channel) {
            console.error("❌ Canal de log não encontrado:", settings.channels.log);
            return false;
        }

        if (!channel.isTextBased() || !('send' in channel)) {
            console.error("❌ Canal não suporta envio de mensagens");
            return false;
        }

        await (channel as TextChannel).send(log(logData));
        console.log(`✅ Log enviado para ${'name' in channel ? channel.name : 'canal desconhecido'}`);
        return true;

    } catch (error) {
        console.error("❌ Erro ao enviar log:", error);
        return false;
    }
}

/**
 * Envia log de sucesso de autenticação
 * @param client - Cliente do Discord
 * @param userData - Dados do usuário
 * @returns Promise<boolean>
 */
export async function sendSuccessLog(
    client: Client,
    userData: {
        username: string;
        id: string;
        ip: string;
    }
): Promise<boolean> {
    return sendAuthLog(client, {
        status: true,
        ip: userData.ip,
        user: userData.username,
        userID: userData.id,
        date: new Date().toISOString()
    });
}

/**
 * Envia log de erro de autenticação
 * @param client - Cliente do Discord
 * @param userData - Dados do usuário
 * @returns Promise<boolean>
 */
export async function sendErrorLog(
    client: Client,
    userData: {
        username: string;
        id: string;
        ip: string;
    }
): Promise<boolean> {
    return sendAuthLog(client, {
        status: false,
        ip: userData.ip,
        user: userData.username,
        userID: userData.id,
        date: new Date().toISOString()
    });
}

/**
 * Verifica se o canal de log está disponível
 * @param client - Cliente do Discord
 * @returns boolean
 */
export function isLogChannelAvailable(client: Client): boolean {
    const channel = client.channels.cache.get(settings.channels.log);
    return !!(channel && channel.isTextBased() && 'send' in channel);
} 