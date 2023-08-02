import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("prize.name"),
    description: t("prize.description"),
    cooldown: 10,
    async execute(interaction) {

        try {

        await interaction.deferReply({ ephemeral: true })

        const sub_command = interaction.options.getSubcommand()

        const user = await User.findOne({ user_id: interaction.user.id })

        if (sub_command == "prize") {

            if (user?.prize_active) return interaction.editReply(errorEmbed(t("prize.not_prize")))

            const integer_random = (user?.premium_active ? [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

            const integer = integer_random[Math.floor(Math.random() * integer_random.length)]

            const money = (user?.money?.money || 0 ) + integer

            await User.updateOne({ user_id: interaction.user.id }, { $set: { "money.money": money, "prize_time": Date.now() + 86400000, "prize_active": true } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("prize.success", { integer }))))

        }

    } catch {
        return
    }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("prize.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("prize.description", { lng: "tr" })
    },
    options: [
        {
            name: "prize",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("prize.prize_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("prize.description", { lng: "tr" })
            },
        }
    ]
}