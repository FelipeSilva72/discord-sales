import { ProductSchema, formatProductData } from "#database";
import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export function editProductMenu(productData: ProductSchema) {
    const { id, name, description, price, stock } = formatProductData(productData);

    const embed = createEmbed({
        title: "Informação sobre o Produto",
        fields: [
            { name: "Nome", value: name },
            { name: "Descrição", value: description },
            { name: "Preço", value: price },
            { name: "Estoque", value: stock },
        ],
        footer: {
            text: id
        },
        color: settings.colors.primary,
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "button/product/edit/name",
            style: ButtonStyle.Primary,
            label: "Alterar Nome",
        }),
        new ButtonBuilder({
            customId: "button/product/edit/description",
            style: ButtonStyle.Primary,
            label: "Alterar Descrição",
        }),
        new ButtonBuilder({
            customId: "button/product/edit/price",
            style: ButtonStyle.Primary,
            label: "Alterar Preço",
        }),
        new ButtonBuilder({
            customId: "button/product/edit/stock",
            style: ButtonStyle.Primary,
            label: "Modificar Estoque",
        }),
    );

    return {
        embeds: [embed],
        components: [row]
    };
}

export function editProductStockMenu(productData: ProductSchema) {
    const { id } = formatProductData(productData);

    const embed = createEmbed({
        description: "Por favor, selecione uma das opções abaixo",
        footer: {
            text: id
        },
        color: settings.colors.info
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "button/product/edit/stock/addLines",
            style: ButtonStyle.Success,
            label: "Adicionar Por Linhas",
        }),
        new ButtonBuilder({
            customId: "button/product/edit/stock/add",
            style: ButtonStyle.Success,
            label: "Adicionar",
        }),
        new ButtonBuilder({
            customId: "button/product/edit/stock/backup",
            style: ButtonStyle.Primary,
            label: "Backup",
            disabled: productData.stock.length < 1
        }),
        new ButtonBuilder({
            customId: "button/product/edit/stock/remove",
            style: ButtonStyle.Danger,
            label: "Remover",
            disabled: productData.stock.length < 1
        }),
        new ButtonBuilder({
            customId: "button/product/edit/stock/clear",
            style: ButtonStyle.Danger,
            label: "Limpar",
            disabled: productData.stock.length < 1
        }),
    );

    const rowWithNewActions = createRow(
        new ButtonBuilder({
            customId: "button/product/edit/stock/back",
            style: ButtonStyle.Secondary,
            label: "Voltar",
        }),
    );

    return {
        embeds: [embed],
        components: [row, rowWithNewActions]
    };
}