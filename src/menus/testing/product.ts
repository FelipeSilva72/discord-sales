import { formatSaleData } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAsset } from "@magicyan/discord";
import { GuildMember, codeBlock } from "discord.js";

interface SalesData {
  member: GuildMember;
  saleAt: Date;
  product: {
    name: string;
    amount: number;
    priceEnd: number;
    itens: string[];
  };
}

export function testingSalePublicProduct(data: SalesData) {
  const { member, saleAt, name, amount, price } = formatSaleData(data);

  const embed = createEmbed({
    title: "Nova Venda",
    fields: [
      { name: "Membro", value: member },
      { name: "Horário", value: saleAt },
      { name: "Produto", value: name },
      { name: "Valor", value: price },
      { name: "Quantidade", value: amount },
    ],
    color: settings.colors.info,
    thumbnail: createEmbedAsset(data.member.displayAvatarURL()),
  });

  return {
    embeds: [embed],
  };
}

export function testingSalePrivateProduct(data: SalesData) {
  const { member, saleAt, name, amount, price } = formatSaleData(data);
  const stock = data.product.itens.map((item) => `- ${item}`);

  const embed = createEmbed({
    title: "Nova Venda",
    fields: [
      { name: "Membro", value: member },
      { name: "Horário", value: saleAt },
      { name: "Produto", value: name },
      { name: "Quantidade", value: amount },
      {
        name: data.product.amount < 1 ? "Item Comprado" : "Itens Comprados",
        value: codeBlock(brBuilder(stock)),
      },
      { name: "Valor", value: price },
    ],
    color: settings.colors.info,
    thumbnail: createEmbedAsset(data.member.displayAvatarURL()),
  });

  return {
    embeds: [embed],
  };
}
