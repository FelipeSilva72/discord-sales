import { CouponSchema, formatCouponData } from "#database";
import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export function editCouponMenu(couponData: CouponSchema) {
  const { id, name, discount } = formatCouponData(couponData);

  const embed = createEmbed({
    title: "Informação sobre o Cupom",
    fields: [
      { name: "Nome", value: name },
      { name: "Desconto", value: discount },
    ],
    footer: {
      text: id,
    },
    color: settings.colors.primary,
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "button/coupon/edit/name",
      style: ButtonStyle.Primary,
      label: "Alterar Nome",
    }),
    new ButtonBuilder({
      customId: "button/coupon/edit/discount",
      style: ButtonStyle.Primary,
      label: "Alterar Desconto",
    })
  );

  return {
    embeds: [embed],
    components: [row],
  };
}
