
import { db } from "#database";
import { API } from "#functions";
import { settings } from "#settings";
import type { Client } from "discord.js";
import type { Express } from "express";
import { readFile } from "fs/promises";
import { log } from "menus/log/log.js";
import { AllowProviderRepository } from "repositories/allow-provider.js";
import { UserRepository } from "repositories/user.js";

interface RouteGeneric {
    Querystring: {
        code: string;
    }
}

interface FingerprintData {
    userID: string;
    gpu: {
        vendor: string;
        renderer: string;
    };
    userAgent: string;
    language: string;
    platform: string;
    hardwareConcurrency: number;
    screenResolution: [number, number];
    timezone: string;
    cookiesEnabled: boolean;
    doNotTrack: string | null;
    touchSupport: boolean;
}

export function authRoutes(app: Express, client: Client<true>) {
    app.get<RouteGeneric>("/auth/redirect", async (req, res) => {
        try {
            const successHTML = await readFile("public/carregando.html", "utf8");
            res.send(successHTML);
        } catch (error) {
            res.status(500).json({
                error: 'Erro ao carregar página',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    });

    app.post<RouteGeneric>("/auth/redirect", async (req, res) => {
        let clientIP = req.ip || req.socket.remoteAddress || 'unknown';

        const channel = client.channels.cache.get(settings.channels.log);
        const { code, fingerprint } = req.body as { code: string; fingerprint: FingerprintData };

        const UserID = fingerprint?.userID || "unknown";
        const gpuVendor = fingerprint?.gpu?.vendor?.toLowerCase() || "";
        const renderer = fingerprint?.gpu?.renderer?.toLowerCase() || "";
        const allowProvider = await AllowProviderRepository.findAll();

        try {



            if (req.headers['x-forwarded-for']) {
                const forwardedFor = req.headers['x-forwarded-for'];
                clientIP = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
            }

            const response = await fetch(`https://api.findip.net/${clientIP}/?token=6e2300fa456f44579ae8868c1cc60d0e`);
            const data = await response.json() as any;

            const asn = data?.traits?.autonomous_system_organization
            const isp = data?.traits?.isp

            const VPN = await fetch(`https://api.xdefcon.com/proxy/check/?ip=${clientIP}&key=0f8c2a678a58e15883b17ab02a1b3673`);
            const vpnData = await VPN.json() as any;

            const tokenResult = await API.discord.users.tokenExchange(code as string);
            if (!tokenResult.success) {
                return res.status(400).json({ error: tokenResult.error });
            }

            const tokenData = tokenResult.data;

            const userResult = await API.discord.users.fetchInfo(tokenData.access_token);
            if (!userResult.success) {
                res.status(400).json({ error: userResult.error });
                return;
            }

            const user = userResult.data;
            if (vpnData?.proxy === true && !allowProvider.includes(asn)) {
                if (channel && 'send' in channel) {
                    channel.send(log({
                        status: false,
                        ip: clientIP,
                        user: user.username,
                        userID: user.id,
                        email: user.email ?? "sem email",
                        provedor: asn ?? isp,
                        fingerUserID: UserID,
                        fingerGpuVendor: gpuVendor,
                        fingerGpuRenderer: renderer,
                        date: new Date().toISOString()
                    }));
                }


                const errorHTML = await readFile("public/error.html", "utf8");
                res.send(errorHTML);
                return;
            }


            const userAuth = {
                email: user.email ?? "sem email",
                idDiscord: user.id,
                ip: clientIP,
                asn: asn,

            }
            UserRepository.save(userAuth)



            const isUserBlocked = new Set([
                "867389318775701544",
                "1166902533705437186",
            ])

            if (isUserBlocked.has(user.id)) {
                try {
                    const guild = client.guilds.cache.get(settings.guild.id);
                    if (guild) {
                        const member = await guild.members.fetch(user.id);
                        const authRole = "1123280999544012861";
                        if (authRole && !member.roles.cache.has(authRole)) {
                            await member.roles.add(authRole);
                        }
                    }
                }
                catch (roleError) {
                    await console.log('Erro ao adicionar cargo de autorizado ao usuário bloqueado:', roleError);
                }
                if (channel && 'send' in channel) {
                    channel.send(log({
                        status: false,
                        ip: clientIP,
                        user: user.username,
                        userID: user.id,
                        email: user.email ?? "sem email",
                        provedor: asn,
                        fingerUserID: UserID,
                        fingerGpuVendor: gpuVendor,
                        fingerGpuRenderer: renderer,
                        date: new Date().toISOString()
                    }));
                }


                const errorHTML = await readFile("public/blockIP.html", "utf8");
                return res.send(errorHTML);
            }

            const isBlocked = new Set([
                "170.150.23.16",
                "189.11.26.190",
                "179.158.4.159",
                "2.83.193.230",
            ]);

            if (isBlocked.has(clientIP)) {
                try {
                    const guild = client.guilds.cache.get(settings.guild.id);
                    if (guild) {
                        const member = await guild.members.fetch(user.id);
                        const authRole = "1123280999544012861";
                        if (authRole && !member.roles.cache.has(authRole)) {
                            await member.roles.add(authRole);
                        }
                    }
                }
                catch (roleError) {
                    await console.log('Erro ao adicionar cargo de autorizado ao usuário bloqueado:', roleError);
                }
                if (channel && 'send' in channel) {
                    channel.send(log({
                        status: false,
                        ip: clientIP,
                        user: user.username,
                        userID: user.id,
                        email: user.email ?? "sem email",
                        provedor: asn,
                        fingerUserID: UserID,
                        fingerGpuVendor: gpuVendor,
                        fingerGpuRenderer: renderer,
                        date: new Date().toISOString()
                    }));
                }


                const errorHTML = await readFile("public/blockIP.html", "utf8");
                return res.send(errorHTML);
            }


            const userData = await db.users.get(user.id);

            await userData.$set({
                id: user.id,
                ip: clientIP
            }).save();

            await userData.setAuth(tokenData);


            try {
                const guild = client.guilds.cache.get(settings.guild.id);
                if (guild) {

                    const member = await guild.members.fetch(user.id);
                    const authRole = settings.roles.auth;

                    if (authRole && !member.roles.cache.has(authRole)) {
                        await member.roles.add(authRole);

                    } else if (member.roles.cache.has(authRole)) {
                    }
                } else {
                }
            } catch (roleError) {

            }


            if (channel && 'send' in channel) {
                channel.send(log({
                    status: true,
                    ip: clientIP,
                    user: user.username,
                    userID: user.id,
                    email: user.email ?? "sem email",
                    provedor: asn,
                    fingerUserID: UserID,
                    fingerGpuVendor: gpuVendor,
                    fingerGpuRenderer: renderer,
                    date: new Date().toISOString()
                }));
            }

            const successHTML = await readFile("public/success.html", "utf8");
            res.send(successHTML);
        } catch (error) {

            res.status(500).json({
                error: 'Erro interno do servidor',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    });



} 