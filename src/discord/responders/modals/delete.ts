import { Responder, ResponderType } from "#base";
import { getProductData, removeProductData } from "#database";
import { res } from "#functions";
import { log } from "#settings";
import { modalFieldsToRecord } from "@magicyan/discord";

type DeleteFields = "productId";

new Responder({
    customId: "modal/delete/:action",
    type: ResponderType.Modal, cache: "cached",
    async run(interaction, { action }) {
        await interaction.deferReply({ ephemeral });

        switch (action) {
            case "product": {
                const { productId } = modalFieldsToRecord<DeleteFields>(interaction.fields);
                const { data } = await getProductData(productId);

                if (!data) {
                    await interaction.editReply(res.primary("Desculpe, não foi possível encontrar o produto"));
                    return;
                }

                await removeProductData(productId)
                .then(async () => {
                    await interaction.editReply(res.success("Parabéns, o produto foi excluído com sucesso"));
                })
                .catch(async (err) => {
                    log.error(err);
                    await interaction.editReply(res.danger("Desculpe, não foi possível excluir o produto"));
                });
                return;
            }
        }
    },
});