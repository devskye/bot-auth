import { createCommand } from "#base";
import { res } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { AllowProviderRepository } from "repositories/allow-provider.js";

createCommand({
    name: "provider",
    description: "Comando de gerenciar provedores",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["Administrator"],
    options: [
        {
            name: "adicionar",
            description: "Adicionar um provedor",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "provedor",
                    description: "Mencione o provedor que deseja",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ],
        },
        {
            name: "remover",
            description: "Remover um provedor",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "ID do provedor que deseja remover",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ],
        },
        {
            name: "listar",
            description: "Listar todos os provedores",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async run(interaction) {
        const { options } = interaction;
        const subcommand = options.getSubcommand(true);

        await interaction.deferReply({ ephemeral: true });

        try {
            switch (subcommand) {

                case "adicionar": {
                    const provider = options.getString("provedor", true);

                    const result = await AllowProviderRepository.add(provider);

                    interaction.editReply(
                        res.success(`Provedor **${result.provedor}** adicionado com sucesso`)
                    );
                    return;
                }

                case "remover": {
                    const id = options.getInteger("id", true);

                    const result = await AllowProviderRepository.remove(id);

                    interaction.editReply(
                        res.success(`Provedor **${result.provedor}** removido com sucesso`)
                    );
                    return;
                }

                case "listar": {
                    const providers = await AllowProviderRepository.findAll();

                    if (providers.length === 0) {
                        interaction.editReply(
                            res.danger("Nenhum provedor encontrado.")
                        );
                        return;
                    }

                    const content = providers
                        .map(p => `🆔 ${p.id} • ${p.provedor}`)
                        .join("\n");

                    interaction.editReply(res.success(content));
                    return;
                }
            }

        } catch (error: any) {
            interaction.editReply(
                res.danger(error.message || "Erro inesperado")
            );
        }
    }
});
