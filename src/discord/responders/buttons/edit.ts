import { Responder, ResponderType } from "#base";
import {
  ProductSchema,
  getCouponData,
  getProductData,
  updateProductData,
} from "#database";
import { res } from "#functions";
import { menus } from "#menus";
import { log } from "#settings";
import { brBuilder, createModalFields } from "@magicyan/discord";
import { ModalBuilder, TextInputStyle } from "discord.js";

new Responder({
  customId: "button/product/edit/:action",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction, { action }) {
    const {
      message: {
        embeds: [messageEmbed],
      },
    } = interaction;
    const productId = messageEmbed.footer!.text;
    const { data } = await getProductData(productId);

    if (!data) {
      await interaction.deferUpdate();
      await interaction.editReply(
        res.primary(
          "Desculpe, não foi possível encontrar os dados do produto",
          {
            components: [],
          }
        )
      );
      return;
    }

    switch (action) {
      case "name": {
        const modal = new ModalBuilder({
          customId: "modal/edit/product/name",
          title: "Alteração de Nome",
          components: createModalFields({
            newName: {
              label: "Nome",
              placeholder: "Por favor, informe um nome para o produto",
              maxLength: 50,
              minLength: 1,
              style: TextInputStyle.Short,
              required,
              value: data.name,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "description": {
        const modal = new ModalBuilder({
          customId: "modal/edit/product/description",
          title: "Alteração de Descrição",
          components: createModalFields({
            newDescription: {
              label: "Descrição",
              placeholder: "Por favor, informe uma descrição para o produto",
              maxLength: 500,
              minLength: 1,
              style: TextInputStyle.Paragraph,
              required,
              value: data.description,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "price": {
        const modal = new ModalBuilder({
          customId: "modal/edit/product/price",
          title: "Alteração de Preço",
          components: createModalFields({
            newPrice: {
              label: "Preço",
              placeholder: "Por favor, informe um preço para o produto",
              style: TextInputStyle.Short,
              required,
              value: data.price.toString(),
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "stock": {
        await interaction.update(menus.products.editStock(data));
        return;
      }
    }
  },
});

new Responder({
  customId: "button/product/edit/stock/:action",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction, { action }) {
    const {
      message: {
        embeds: [messageEmbed],
      },
    } = interaction;
    const productId = messageEmbed.footer!.text;
    const { data } = await getProductData(productId);

    if (!data) {
      await interaction.deferUpdate();
      await interaction.editReply(
        res.primary("Desculpe, não foi possível encontrar os dados do produto")
      );
      return;
    }

    switch (action) {
      case "addLines": {
        const modal = new ModalBuilder({
          customId: "modal/edit/product/stock/addLines",
          title: "Adição de Estoque",
          components: createModalFields({
            itens: {
              label: "Itens",
              placeholder: "Por favor, informe os itens que serão adicionados",
              style: TextInputStyle.Paragraph,
              required,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "add": {
        const modal = new ModalBuilder({
          customId: "modal/edit/product/stock/add",
          title: "Adição de Estoque",
          components: createModalFields({
            add: {
              label: "Item",
              placeholder: "Por favor, informe o item que será adicionado",
              style: TextInputStyle.Short,
              required,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "backup": {
        await interaction.deferUpdate();

        if (data.stock.length < 1) {
          await interaction.followUp(
            res.primary("Desculpe, esse produto não possui estoque")
          );
          return;
        }

        const messageStock = data.stock.map((item) => `- ${item}`);

        await interaction.followUp(res.info(brBuilder(messageStock)));
        return;
      }
      case "remove": {
        const modal = new ModalBuilder({
          customId: "modal/edit/product/stock/remove",
          title: "Remoção de Estoque",
          components: createModalFields({
            remove: {
              label: "Item",
              placeholder: "Por favor, informe o item que será removido",
              style: TextInputStyle.Short,
              required,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "clear": {
        await interaction.deferUpdate();

        await updateProductData(productId, {
          ...data,
          stock: [],
        })
          .then(async () => {
            const newData: ProductSchema = {
              ...data,
              stock: [],
            };

            await interaction.editReply(menus.products.editStock(newData));
            await interaction.followUp(
              res.success(
                "Parabéns, o estoque do produto foi limpo com sucesso"
              )
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível limpar o estoque")
            );
          });
        return;
      }
      case "back": {
        await interaction.update(menus.products.edit(data));
        return;
      }
    }
  },
});

new Responder({
  customId: "button/coupon/edit/:action",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction, { action }) {
    const {
      message: {
        embeds: [messageEmbed],
      },
    } = interaction;
    const couponId = messageEmbed.footer!.text;
    const { data } = await getCouponData(couponId);

    if (!data) {
      await interaction.deferUpdate();
      await interaction.editReply(
        res.primary("Desculpe, não foi possível encontrar os dados do cupom", {
          components: [],
        })
      );
      return;
    }

    switch (action) {
      case "name": {
        const modal = new ModalBuilder({
          customId: "modal/edit/coupon/name",
          title: "Alteração de Nome",
          components: createModalFields({
            newName: {
              label: "Nome",
              placeholder: "Por favor, informe um nome para o cupom",
              maxLength: 50,
              minLength: 1,
              style: TextInputStyle.Short,
              required,
              value: data.name,
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
      case "discount": {
        const modal = new ModalBuilder({
          customId: "modal/edit/coupon/discount",
          title: "Alteração de Desconto",
          components: createModalFields({
            newDiscount: {
              label: "Desconto",
              placeholder: "Por favor, informe um desconto para o cupom",
              style: TextInputStyle.Short,
              required,
              value: data.discount.toString(),
            },
          }),
        });

        await interaction.showModal(modal);
        return;
      }
    }
  },
});
