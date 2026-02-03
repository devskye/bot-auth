import { createCommand } from "#base";
import { db } from "#database";
import { API, res } from "#functions";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

const guildIdDiscord = [
        { name: "VBR Community", id: "1404252306706268363" },
        { name: "Slinky Cheats", id: "1218679211016065024" },
        { name: "xxx", id: "1453097729793200150" },
        { name: "Ghost", id: "1301938251036102656" },
        { name: "Saturn", id: "917605669253828645" },
        { name: "Fex", id: "1016944741297946704" },
        { name: "Qwerty", id: "1234873461722185790" },
        { name: "ZeroTrace", id: "1455930303305486357" },
        { name: "ECLYPSE STORE" , id: "1344328614799212564" },
        { name: "Ghost Loja2" , id: "1268420106514464768" },
        { name: "BT69" , id: "1004276637703098448" },
        { name: "Skz Menu" , id: "1377747944987562086" },
        { name: "Suporte Chapinho" , id: "1384998310078844968" },
        { name: "Team Goat" , id: "1131716322913419348" },
        { name: "Arquive Comunnity" , id: "1319487957547356190" },
        { name: "OWL TEAM" , id: "942479753028452362" },
        { name: "Hidden Bax" , id: "1153288829327904809" },
        { name: "HenriCheats 7x" , id: "1442636351194271856" },
        { name: "DHN Community" , id: "1279620602461819021" },
        { name: "Nexy Store" , id: "1355761213031579780" },
        { name: "Alfa System", id: "1453770022722867252" },
    ];

createCommand({
    name: "profile",
    description: "ver perfil do usuario",
    type: ApplicationCommandType.ChatInput,
     options: [
        {
            name: "usuário",
            description: "Mencione um usuario",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    async run (interaction) {
        const {options} = interaction;

        await interaction.deferReply({ephemeral: true});

        const user = options.getUser("usuário", true)
        const userData = await db.users.get(user.id);
        const token = await userData.getAcessToken();

        if (!token) {
            await interaction.editReply(res.danger("Este usuario não autorizou o bot."));
            return;
        }
        
        let result = await API.discord.users.fetchInfo(token);

        if (!result.success) {
            const token = await userData.getAcessToken(true);
            token ? result = await API.discord.users.fetchInfo(token) : null;
        }
        if (!result.success) {
            await interaction.editReply(res.danger("Este usuário revogou a autorização."));
            return;
        }
        
        let guildsResult = await API.discord.users.fetchGuilds(token);
        
        if (!guildsResult.success) {
            const token = await userData.getAcessToken(true);
            token ? guildsResult = await API.discord.users.fetchGuilds(token) : null;
        }
        
        const userGuildIds = guildsResult.success ? guildsResult.data.map(g => g.id) : [];
        
        const serversInfo = guildIdDiscord.map(server => {
            const hasServer = userGuildIds.includes(server.id);
            const status = hasServer ? "SIM" : "NÃO";
            return `${server.name} : **${status}**`;
        }).join("\n");
        
        const embed = createEmbed({
            thumbnail: user.displayAvatarURL(),
            description: brBuilder(
                `## Perfil de ${user}`,
                `Username: **${user.username}**`,
                `Discriminator: **#${user.discriminator}**`,
                `ID: **${user.id}**`,
                `Email: **${result.data.email ?? "Não disponível"}**`,
                `MFA: **${result.data.mfa_enabled ? "Ativado" : "Desativado"}**`,
                `Verificado: **${result.data.verified ? "Sim" : "Não"}**`,
                `Bot: **${user.bot ? "Sim" : "Não"}**`,
                "",
                `### Presença em Servidores`,
                serversInfo
            )
        })

        interaction.editReply({embeds: [embed]});
    }
});