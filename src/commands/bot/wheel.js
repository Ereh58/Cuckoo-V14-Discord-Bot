import { t } from "i18next"
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"

export const data = {
    name: t("wheel.name"),
    description: t("wheel.description"),
    cooldown: 5,
    async execute(interaction) {

        const modal = new ModalBuilder()
        .setTitle(t("wheel.model_title"))
        .setCustomId("wheel")
        .setComponents(
            new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setCustomId("choices")
                        .setPlaceholder(t("wheel.model_place"))
                        .setLabel(t("wheel.model_choices"))
                        .setStyle(TextInputStyle.Short)
                        .setMinLength(3)
                        .setMaxLength(4000)
                        .setRequired(true)
                )
        )

    interaction.showModal(modal)

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("wheel.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("wheel.description", { lng: "tr" })
    },
}