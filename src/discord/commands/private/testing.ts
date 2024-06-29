import { Command } from "#base";
import { getGuildData } from "#database";
import { res } from "#functions";
import { menus } from "#menus";
import { log } from "#settings";
import { findChannel, findRole } from "@magicyan/discord";
import { ApplicationCommandOptionType } from "discord.js";

new Command({
  name: "teste",
  description: "Comando de Teste",
  options: [
    {
      name: "vendas",
      description: "Teste o sistema de vendas",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async run(interaction) {
    await interaction.deferReply({ ephemeral });

    const { options, guild } = interaction;
    const subCommand = options.getSubcommand(true);

    switch (subCommand) {
      case "vendas": {
        const { data } = await getGuildData(guild);

        if (!data) {
          await interaction.editReply(
            res.primary(
              "Desculpe, não foi possível encontrar os dados do sistema"
            )
          );
          return;
        }

        const channelSalesPublic = findChannel(guild).byId(
          data.sales?.channelSalesPublicId ?? ""
        );
        const channelSalesPrivate = findChannel(guild).byId(
          data.sales?.channelSalesPrivateId ?? ""
        );
        const roleSales = findRole(guild).byId(data.sales?.roleSalesId ?? "");

        if (!channelSalesPublic) {
          await interaction.editReply(
            res.primary(
              "Desculpe, não foi possível encontrar o canal de vendas públicas"
            )
          );
          return;
        }

        if (!channelSalesPrivate) {
          await interaction.editReply(
            res.primary(
              "Desculpe, não foi possível encontrar o canal de vendas privadas"
            )
          );
          return;
        }

        if (!roleSales) {
          await interaction.editReply(
            res.primary(
              "Desculpe, não foi possível encontrar o cargo de cliente"
            )
          );
          return;
        }

        const dataPublic = {
          member: interaction.member,
          saleAt: new Date(),
          product: {
            name: "Teste",
            amount: 2,
            priceEnd: 2,
            itens: ["a", "b"],
          },
        };

        const dataPrivate = {
          member: interaction.member,
          saleAt: new Date(),
          product: {
            name: "Teste",
            amount: 2,
            priceEnd: 2,
            itens: ["a", "b"],
          },
        };

        Promise.all([
          await channelSalesPublic.send(menus.testing.public(dataPublic)),
          await channelSalesPrivate.send(menus.testing.private(dataPrivate)),
        ])
          .then(async () => {
            await interaction.editReply(
              res.success("Parabéns, a venda foi testada com sucesso")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.editReply(
              res.danger("Desculpe, não foi possível testa a venda")
            );
          });
        return;
      }
    }
  },
});
