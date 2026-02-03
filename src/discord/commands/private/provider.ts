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
        switch (subcommand) {
            case "adicionar": {
                await interaction.deferReply({ ephemeral: true });
                const provider = options.getString("provedor", true);
                const result = await AllowProviderRepository.add(provider);
                if (result) {
                    interaction.editReply(res.danger(result));
                    return;
                }
                interaction.editReply(res.success("Provedor adicionado com sucesso"));
                return;
            }
            case "remover": {
                await interaction.deferReply({ ephemeral: true });
                const id = options.getInteger("id", true);
                const result = await AllowProviderRepository.remove(id);
                if (result) {
                    interaction.editReply(res.danger(result));
                    return;
                }
                interaction.editReply(res.success("Provedor removido com sucesso"));
                return;
            }
            case "listar": {
                await interaction.deferReply({ ephemeral: true });
                const providers = await AllowProviderRepository.findAll();
                if (providers.length === 0) {
                    interaction.editReply(res.danger("Nenhum provedor encontrado."));
                    return;
                }
                const content = providers.map(p => `ID: ${p.id} - Provedor: ${p.provedor}`).join("\n");
                interaction.editReply(res.success(content));
                return;
            }
        }
    }
});
