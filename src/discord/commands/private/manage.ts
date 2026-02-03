import { getInvitableGuilds, icon, res } from "#functions";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createCommand } from "discord/index.js";
import { API } from "#functions";
import { Guild, InteractionReplyOptions, OAuth2Scopes } from "discord.js";
import { db } from "#database";

createCommand({
    name: "gerenciar",
    description: "Comando de gerenciar",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["Administrator"],
    options: [
        {
            name: "membros",
            description: "Gerenciar membros",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "adicionar",
                    description: "Adicionar um membro em outros servidores",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "membro",
                            description: "Mencione o membro que deseja",
                            type: ApplicationCommandOptionType.User,
                            required

                        }

                    ],

                },
                {
                    name: "mover",
                    description: "Mover todos membros para outros servidores",
                    type: ApplicationCommandOptionType.Subcommand,


                }


            ],

        }

    ],
    async run(interaction) {

        const { options, client } = interaction
        const subcommand = options.getSubcommand(true)
        switch (options.getSubcommandGroup(true)) {
            case "membros": {
                switch (subcommand) {
                    case "adicionar": {
                        await interaction.deferReply({ ephemeral: true })
                        const mention = options.getMember("membro")!
                        const mentionData = await db.users.get(mention.id)
                        const token = await mentionData.getAcessToken()

                        if (!token) {
                            interaction.editReply(res.default(`${icon.macos_close} Este usuário não autorizou o bot.`))
                            return;
                        }
                        const guilds = await getInvitableGuilds(client)
                        interaction.editReply(menus.manage.members.move(guilds, 0, mention))
                        return;
                    }
                    case "mover": {

                        await interaction.deferReply({ ephemeral: true })
                        const guilds = await getInvitableGuilds(client)
                        interaction.editReply(menus.manage.members.move(guilds, 0))
                        return;
                    }
                }
            }
        }

    }



});