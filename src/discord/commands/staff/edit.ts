import { Command } from "#base";
import { createModalFields } from "@magicyan/discord";
import {
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputStyle,
} from "discord.js";

new Command({
  name: "editar",
  description: "Comando de Edição",
  options: [
    {
      name: "produto",
      description: "Editar Produto",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "cupom",
      description: "Editar Cupom",
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
          customId: "modal/edit/product",
          title: "Edição de Produto",
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
          customId: "modal/edit/coupon",
          title: "Edição de Cupom",
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
