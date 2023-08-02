import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { EmbedBuilder } from "discord.js"
import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("premium.name"),
    description: t("premium.description"),
    async execute(interaction) {

        try {

        await interaction.deferReply({ ephemeral: true })

        if (interaction.user.id !== process.env.OWNER_ID) return interaction.editReply(errorEmbed(t("premium.error_message")))

        const sub_command = interaction.options.getSubcommand()
        
        if (sub_command == "add") {

            const time = interaction.options.getString("time")

            const user = interaction.options.getUser("user")

            if (!user) return

            const users = user.id

            if (time == "weekly") {
                await User.updateOne({ user_id: user.id }, { $set: { "premium_active": true, "time": Date.now() + 604800000 } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("premium.add_user_premium", { users }))))
            }
            if (time == "monthly") {
                await User.updateOne({ user_id: user.id }, { $set: { "premium_active": true, "time": Date.now() + 2419200000 } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("premium.add_user_premium", { users }))))
            }
            if (time == "yearly") {
                await User.updateOne({ user_id: user.id }, { $set: { "premium_active": true, "time": Date.now() + 31557600000 } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("premium.add_user_premium", { users }))))
            }
            if (time == "infiniti") {
                await User.updateOne({ user_id: user.id }, { $set: { "premium_active": true, "infiniti_premium": true } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("premium.add_user_premium", { users }))))
            }
        }

        if (sub_command == "remove") {
            const user = interaction.options.getUser("user")

            if (!user) return

            const users = user.id/

            await User.updateOne({ user_id: user.id }, { $set: { "premium_active": false, "infiniti_premium": false } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("premium.remove_user_premium", { users }))))
        }

        if (sub_command == "list") {

            const users = await User.find()

            var infiniti_premium = []
            var other = []

            users.forEach((user) => {
                infiniti_premium.push(user?.infiniti_premium ? `<@${user?.user_id}>` : "")
                other.push(user?.premium_active ? `<@${user?.user_id}>` : "")
            })

            const options = [
                { name: "📌 İnfiniti", value: infiniti_premium.join(""), inline: true },
                { name: "🔗 Other", value: other.join(""), inline: true }
            ]

            const premium_embed = new EmbedBuilder()
            .setColor(process.env.MAIN_COLOR)
            .addFields(options)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setDescription(`💎 **${interaction.client.user.username} Premium list**`)
            .setThumbnail(interaction.client.user.displayAvatarURL())

            interaction.editReply({ embeds: [premium_embed] })

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
        tr: t("premium.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("premium.description", { lng: "tr" })
    },
    options: [
        {
            name: "add",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("premium.add_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("premium.description", { lng: "tr" })
            },
            options: [
                {
                    name: "user",
                    description: data.description,
                    required: true,
                    type: 6,
                    name_localizations: {
                        tr: t("premium.user.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("premium.description", { lng: "tr" })
                    },
                },
                {
                    name: "time",
                    description: data.description,
                    required: true,
                    type: 3,
                    name_localizations: {
                        tr: t("premium.time.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("premium.description", { lng: "tr" })
                    },
                    choices: [
                        { name: "Weekly", value: "weekly" },
                        { name: "Monthly", value: "monthly" },
                        { name: "Yearly", value: "yearly" },
                        { name: "Unlimited", value: "infiniti" }
                    ]
                }
            ]
        },
        {
            name: "remove",
            description: data.description,
            name_localizations: {
                tr: t("premium.remove_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("premium.description", { lng: "tr" })
            },
            type: 1,
            options: [
                {
                    name: "user",
                    description: data.description,
                    required: true,
                    type: 6,
                    name_localizations: {
                        tr: t("premium.user.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("premium.description", { lng: "tr" })
                    },
                }
            ]
        },
        {
            name: "list",
            description: data.description,
            name_localizations: {
                tr: t("premium.list_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("premium.description", { lng: "tr" })
            },
            type: 1
        }
    ]
}