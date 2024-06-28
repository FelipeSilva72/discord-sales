import { Responder, ResponderType } from "#base";
import { getProductData, setProductData } from "#database";
import { res } from "#functions";
import { log } from "#settings";
import { modalFieldsToRecord } from "@magicyan/discord";

type CreateFields = "productId"

new Responder({
    customId: "modal/create/:action",
    type: ResponderType.Modal, cache: "cached",
    async run(interaction, { action }) {
        await interaction.deferReply({ ephemeral });

        const fields = modalFieldsToRecord<CreateFields>(interaction.fields);

        switch (action) {
            case "product": {
                const { data } = await getProductData(fields.productId);

                if (data) {
                    await interaction.editReply(res.primary("Desculpe, mas já existe um produto com esse ID"));
                    return;
                }

                await setProductData(fields.productId, {
                    name: "Nome Padrão...",
                    description: "Descrição Padrão...",
                    price: 10,
                    stock: []
                })
                .then(async () => {
                    await interaction.editReply(res.success("Parabéns, o produto foi criado com sucesso"));
                })
                .catch(async (err) => {
                    log.error(err);
                    await interaction.editReply(res.danger("Desculpe, ocorreu um erro ao tentar criar o produto"));
                });
                return;
            }
        }
    },
});