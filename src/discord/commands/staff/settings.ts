import { Command } from "#base";
import { upsetGuildData } from "#database";
import { res } from "#functions";
import { log } from "#settings";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

new Command({
    name: "configurar",
    description: "Comando de Configurações",
    options: [
        {
            name: "sistemas",
            description: "Configurar Sistemas",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "vendas",
                    description: "Sistema de Vendas",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "cargo",
                            description: "Por favor, informe o cargo de cliente",
                            type: ApplicationCommandOptionType.Role,
                            required
                        },
                        {
                            name: "públicas",
                            description: "Por favor, informe o canal de vendas públicas",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required
                        },
                        {
                            name: "privadas",
                            description: "Por favor, informe o canal de vendas privadas",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required
                        },
                    ]
                }
            ]
        }
    ],
    defaultMemberPermissions: ["Administrator"],
    async run(interaction) {
        await interaction.deferReply({ ephemeral });

        const { options, guild } = interaction;
        const group = options.getSubcommandGroup();
        const subCommand = options.getSubcommand();

        switch (group) {
            case "sistemas": {
                switch (subCommand) {
                    case "vendas": {
                        const data = {
                            roleSalesId: options.getRole("cargo", true).id,
                            channelSalesPublicId: options.getChannel("públicas", true).id,
                            channelSalesPrivateId: options.getChannel("privadas", true).id,
                        };

                        await upsetGuildData(guild, {
                            sales: {
                                ...data,
                            }
                        })
                        .then(async () => {
                            await interaction.editReply(res.success("Parabéns, o sistema foi configurado com sucesso"));
                        })
                        .catch(async (err) => {
                            log.error(err);
                            await interaction.editReply(res.danger("Desculpe, não foi possível configurar o sistema"));
                        });
                    }
                }
                return;
            }
        }
    },
});