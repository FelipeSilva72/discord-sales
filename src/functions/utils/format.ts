import { formatProductPrice } from "#database";
import { GuildMember, time } from "discord.js";

interface SalesData {
  member: GuildMember;
  saleAt: Date;
  product: { name: string; amount: number; priceEnd: number; itens: string[] };
}

export function formatSaleData(data: SalesData) {
  return {
    member: `@${data.member.displayName}`,
    saleAt: time(data.saleAt),
    name: data.product.name,
    price: formatProductPrice(data.product.priceEnd),
    amount:
      data.product.amount < 1
        ? data.product.amount + " Item"
        : data.product.amount + " Itens",
  };
}
