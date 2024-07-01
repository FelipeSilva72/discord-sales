import { Responder, ResponderType } from "#base";
import {
  CouponSchema,
  ProductSchema,
  getCouponData,
  getProductData,
  updateCouponData,
  updateProductData,
} from "#database";
import { res } from "#functions";
import { menus } from "#menus";
import { log } from "#settings";
import { modalFieldsToRecord } from "@magicyan/discord";

type EditFields =
  | "productId"
  | "newName"
  | "newDescription"
  | "newPrice"
  | "itens"
  | "add"
  | "remove"
  | "couponId"
  | "newDiscount";

new Responder({
  customId: "modal/edit/:action",
  type: ResponderType.Modal,
  cache: "cached",
  async run(interaction, { action }) {
    await interaction.deferReply({ ephemeral });

    const { productId, couponId } = modalFieldsToRecord<EditFields>(
      interaction.fields
    );

    switch (action) {
      case "product": {
        const { data } = await getProductData(productId);

        if (!data) {
          await interaction.editReply(
            res.primary("Desculpe, não foi possível encontrar o produto")
          );
          return;
        }

        await interaction.editReply(menus.products.edit(data));
        return;
      }
      case "coupon": {
        const { data } = await getCouponData(couponId);

        if (!data) {
          await interaction.editReply(
            res.primary("Desculpe, não foi possível encontrar o cupom")
          );
          return;
        }

        await interaction.editReply(menus.coupons.edit(data));
        return;
      }
    }
  },
});

new Responder({
  customId: "modal/edit/product/:action",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction, { action }) {
    await interaction.deferUpdate();

    const {
      message: {
        embeds: [messageEmbed],
      },
    } = interaction;
    const productId = messageEmbed.footer!.text;
    const { data } = await getProductData(productId);

    if (!data) {
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
        const { newName } = modalFieldsToRecord<EditFields>(interaction.fields);

        await updateProductData(productId, {
          ...data,
          name: newName,
        })
          .then(async () => {
            const newData: ProductSchema = {
              ...data,
              name: newName,
            };

            await interaction.editReply(menus.products.edit(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o produto atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
      case "description": {
        const { newDescription } = modalFieldsToRecord<EditFields>(
          interaction.fields
        );

        await updateProductData(productId, {
          ...data,
          description: newDescription,
        })
          .then(async () => {
            const newData: ProductSchema = {
              ...data,
              description: newDescription,
            };

            await interaction.editReply(menus.products.edit(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o produto atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
      case "price": {
        const { newPrice: price } = modalFieldsToRecord<EditFields>(
          interaction.fields
        );
        const newPrice = Number.parseInt(price);

        if (isNaN(newPrice)) {
          await interaction.followUp(
            res.primary("Desculpe, o preço do produto deve ser um número")
          );
          return;
        }

        if (newPrice < 1) {
          await interaction.followUp(
            res.primary(
              "Desculpe, o preço do produto deve ser maior que R$ 1,00"
            )
          );
          return;
        }

        await updateProductData(productId, {
          ...data,
          price: newPrice,
        })
          .then(async () => {
            const newData: ProductSchema = {
              ...data,
              price: newPrice,
            };

            await interaction.editReply(menus.products.edit(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o produto atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
    }
  },
});

new Responder({
  customId: "modal/edit/product/stock/:action",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction, { action }) {
    await interaction.deferUpdate();

    const {
      message: {
        embeds: [messageEmbed],
      },
    } = interaction;
    const productId = messageEmbed.footer!.text;
    const { data } = await getProductData(productId);

    if (!data) {
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
      case "addLines": {
        const { itens: addLines } = modalFieldsToRecord<EditFields>(
          interaction.fields
        );
        const itens = addLines.split("\n");
        const newStock = [...data.stock, ...itens];

        await updateProductData(productId, {
          ...data,
          stock: newStock,
        })
          .then(async () => {
            const newData: ProductSchema = {
              ...data,
              stock: newStock,
            };

            await interaction.editReply(menus.products.editStock(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o produto atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
      case "add": {
        const { add: newItem } = modalFieldsToRecord<EditFields>(
          interaction.fields
        );

        if (data.stock.includes(newItem)) {
          await interaction.followUp(
            res.primary("Desculpe, esse item já está adicionado")
          );
          return;
        }

        const newStock = [...data.stock, newItem];

        await updateProductData(productId, {
          ...data,
          stock: newStock,
        })
          .then(async () => {
            const newData: ProductSchema = {
              ...data,
              stock: newStock,
            };

            await interaction.editReply(menus.products.editStock(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o produto atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
      case "remove": {
        const { remove: removeItem } = modalFieldsToRecord<EditFields>(
          interaction.fields
        );

        if (!data.stock.includes(removeItem)) {
          await interaction.followUp(
            res.primary("Desculpe, esse item não está adicionado")
          );
          return;
        }

        const newStock = data.stock.filter((item) => item != removeItem);

        await updateProductData(productId, {
          ...data,
          stock: newStock,
        })
          .then(async () => {
            const newData: ProductSchema = {
              ...data,
              stock: newStock,
            };

            await interaction.editReply(menus.products.editStock(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o produto atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
    }
  },
});

new Responder({
  customId: "modal/edit/coupon/:action",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction, { action }) {
    await interaction.deferUpdate();

    const {
      message: {
        embeds: [messageEmbed],
      },
    } = interaction;
    const couponId = messageEmbed.footer!.text;
    const { data } = await getCouponData(couponId);

    if (!data) {
      await interaction.editReply(
        res.primary("Desculpe, não foi possível encontrar os dados do cupom", {
          components: [],
        })
      );
      return;
    }

    switch (action) {
      case "name": {
        const { newName } = modalFieldsToRecord<EditFields>(interaction.fields);

        await updateCouponData(couponId, {
          ...data,
          name: newName,
        })
          .then(async () => {
            const newData: CouponSchema = {
              ...data,
              name: newName,
            };

            await interaction.editReply(menus.coupons.edit(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o cupom atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
      case "discount": {
        const { newDiscount: discount } = modalFieldsToRecord<EditFields>(
          interaction.fields
        );
        const newDiscount = Number.parseInt(discount);

        if (isNaN(newDiscount)) {
          await interaction.followUp(
            res.primary("Desculpe, o desconto do cupom deve ser um número")
          );
          return;
        }

        if (newDiscount < 1) {
          await interaction.followUp(
            res.primary(
              "Desculpe, o desconto do cupom deve ser maior que R$ 1,00"
            )
          );
          return;
        }

        await updateCouponData(couponId, {
          ...data,
          discount: newDiscount,
        })
          .then(async () => {
            const newData: CouponSchema = {
              ...data,
              discount: newDiscount,
            };

            await interaction.editReply(menus.coupons.edit(newData));
            await interaction.followUp(
              res.success("Parabéns, informação sobre o cupom atualizada")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível atualizar a informação")
            );
          });
        return;
      }
    }
  },
});
