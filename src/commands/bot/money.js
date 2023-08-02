import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("money.name"),
    description: t("money.description"),
    cooldown: 7,
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const { e } = interaction.client

        const sub_command = interaction.options.getSubcommand()

        const user = await User.findOne({ user_id: interaction.user.id })

        if (sub_command == "send") {

            const send_user = interaction.options.getUser("user")
            const integer = interaction.options.getInteger("money")

            const user_send = await User.findOne({ user_id: send_user.id })

            if (interaction.user.id !== process.env.OWNER_ID) {

                const money = integer - (user?.money?.money || 0)

                if ((user?.money?.money || 0) < integer) return interaction.editReply(e.errorEmbed(t("money.dont_money", { money })))

                const user_money = (user_send?.money?.money || 0) + integer
                const old_money = (user?.money?.money || 0) - integer
    
                await User.updateOne({ user_id: send_user.id }, { $set: { "money.money": user_money } }, { upsert: true }).then(async () => {
                    await User.updateOne({ user_id: interaction.user.id }, { $set: { "money.money": old_money } }, { upsert: true }).then(() => interaction.editReply(e.successEmbed(t("money.done", { old_money }))))
                })

            } else {

                const user_money = (user_send?.money?.money || 0) + integer
    
                await User.updateOne({ user_id: send_user.id }, { $set: { "money.money": user_money } }, { upsert: true }).then(() => {
                    const old_money = (user?.money?.money || 0) 
                    
                    interaction.editReply(e.successEmbed(t("money.done", { old_money })))
                })

            }

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("money.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("money.description", { lng: "tr" })
    },
    options: [
        {
            name: "send",
            description: "Allows you to send cuckoo coins to anyone you want",
            type: 1,
            name_localizations: {
                tr: t("money.send.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("money.send.description", { lng: "tr" })
            },
            options: [
                {
                    name: "user",
                    description: "Please select the user to whom the cuckoo coin will be sent",
                    type: 6,
                    required: true,
                    name_localizations: {
                        tr: t("money.user.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("money.user.description", { lng: "tr" })
                    },
                },
                {
                    name: "money",
                    description: "Please choose how many cuckoo coins to send to the specified user",
                    type: 4,
                    required: true,
                    name_localizations: {
                        tr: t("money.money.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("money.money.description", { lng: "tr" })
                    },
                }
            ]
        }
    ]
}