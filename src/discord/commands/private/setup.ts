import { res } from "#functions";
import { menus } from "#menus";
import { ApplicationCommandType } from "discord.js";
import { createCommand } from "discord/index.js";
import { API } from "#functions";
import {   Guild, InteractionReplyOptions, OAuth2Scopes } from "discord.js";

createCommand({
    name: "setup",
    description: "Comando para configurar o bot",
    type: ApplicationCommandType.ChatInput,
     defaultMemberPermissions:["Administrator"],
    async run(interaction){
        const { guild } = interaction;

        try {
            await interaction.deferReply({ephemeral: true});
            const url = API.discord.users.createAuthorizationURL(
                OAuth2Scopes.Identify,
                OAuth2Scopes.Email,
                OAuth2Scopes.Guilds,
                OAuth2Scopes.GuildsJoin,
                OAuth2Scopes.Connections
        
        
             );
            const message = await interaction.channel?.send(menus.auth.panel(guild,url));
            
            if (message) {
                await interaction.editReply(res.success(`Menu enviado com sucesso! ${message.url}`));
            } else {
                await interaction.editReply(res.danger("Erro ao enviar menu"));
            }
        } catch (error) {
            console.error("Erro no comando setup:", error);
            
            
        }
    }
});