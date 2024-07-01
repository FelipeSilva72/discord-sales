import { Command } from "#base";
import { createModalFields } from "@magicyan/discord";
import {
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputStyle,
} from "discord.js";

new Command({
  name: "criar",
  description: "Comando de Criação",
  options: [
    {
      name: "produto",
      description: "Criar Produto",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "cupom",
      description: "Criar Cupom",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async run(interaction) {
    const { options } = interaction;
    const subCommand = options.getSubcommand(true);

    switch (subCommand) {
      case "produto": {
        const modal = new ModalBuilder({
          customId: "modal/create/product",
          title: "Criação de Produto",
          components: createModalFields({
            productId: {
              label: "ID",
              placeholder: "Por favor, informe um ID para o produto",
              maxLength: 15,
              minLength: 1,
              style: TextInputStyle.Short,
              required,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "cupom": {
        const modal = new ModalBuilder({
          customId: "modal/create/coupon",
          title: "Criação de Cupom",
          components: createModalFields({
            couponId: {
              label: "ID",
              placeholder: "Por favor, informe um ID para o cupom",
              maxLength: 15,
              minLength: 1,
              style: TextInputStyle.Short,
              required,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
    }
  },
});
