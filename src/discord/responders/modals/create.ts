import { Responder, ResponderType } from "#base";
import { getProductData, setProductData, getCouponData, setCouponData } from "#database";
import { res } from "#functions";
import { log } from "#settings";
import { modalFieldsToRecord } from "@magicyan/discord";

type CreateFields = "productId" | "couponId";

new Responder({
  customId: "modal/create/:action",
  type: ResponderType.Modal,
  cache: "cached",
  async run(interaction, { action }) {
    await interaction.deferReply({ ephemeral });

    const { productId, couponId } = modalFieldsToRecord<CreateFields>(
      interaction.fields
    );

    switch (action) {
      case "product": {
        const { data } = await getProductData(productId);

        if (data) {
          await interaction.editReply(
            res.primary("Desculpe, já existe um produto com esse ID")
          );
          return;
        }

        await setProductData(productId, {
          id: productId,
          name: "Nome Padrão...",
          description: "Descrição Padrão...",
          price: 10,
          stock: [],
        })
          .then(async () => {
            await interaction.editReply(
              res.success("Parabéns, o produto foi criado com sucesso")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.editReply(
              res.danger("Desculpe, ocorreu um erro ao tentar criar o produto")
            );
          });
        return;
      }
      case "coupon": {
        const { data } = await getCouponData(couponId);

        if (data) {
          await interaction.editReply(
            res.primary("Desculpe, já existe um cupom com esse ID")
          );
          return;
        }

        await setCouponData(couponId, {
          id: couponId,
          name: "Nome Padrão...",
          discount: 10,
        })
          .then(async () => {
            await interaction.editReply(
              res.success("Parabéns, o cupom foi criado com sucesso")
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.editReply(
              res.danger("Desculpe, ocorreu um erro ao tentar criar o cupom")
            );
          });
        return;
      }
    }
  },
});
