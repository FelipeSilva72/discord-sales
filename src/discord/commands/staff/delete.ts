import { Command } from "#base";
import { createModalFields } from "@magicyan/discord";
import {
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputStyle,
} from "discord.js";

new Command({
  name: "excluir",
  description: "Comando de Remoção",
  options: [
    {
      name: "produto",
      description: "Excluir Produto",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "cupom",
      description: "Excluir Cupom",
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
          customId: "modal/delete/product",
          title: "Remoção de Produto",
          components: createModalFields({
            productId: {
              label: "ID",
              placeholder: "Por favor, informe um ID de produto",
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
          customId: "modal/delete/coupon",
          title: "Remoção de Cupon",
          components: createModalFields({
            couponId: {
              label: "ID",
              placeholder: "Por favor, informe um ID de cupom",
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
