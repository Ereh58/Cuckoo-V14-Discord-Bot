import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("youtube_alert.name"),
    description: t("youtube_alert.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const sub_command = interaction.options.getSubcommand()

        const { database, e } = interaction.client
        const { guild, user } = interaction

        const premim = await User.findOne({ user_id: user.id })

        if (sub_command == "alert") {

            if (!premim?.premium_active) return interaction.editReply(errorEmbed(t("not_premium", { ns: "common" })))

            const status = interaction.options.getString("status")

            if (status == "enable") {

                const channel = interaction.options.getChannel("channel")
                const username = interaction.options.getString("channel-id")
                const role = interaction.options.getRole("tag")

                if (!channel) return interaction.editReply(e.errorEmbed(t("twitch.not_channel")))
                if (!role) return interaction.editReply(e.errorEmbed(t("youtube_alert.not_role")))
                if (!username) return interaction.editReply(e.errorEmbed(t("youtube_alert.not_user")))
                if (!username.length) return interaction.editReply(e.errorEmbed(t("youtube_alert.not_user")))

                const channel_id = channel.id

                await database.updateGuild(guild.id, { $set: { "youtube_alert.isActive": true, "youtube_alert.channel": channel.id, "youtube_alert.channel_id": username, "youtube_alert.role": role.id, "lng": interaction.guild.preferredLocale } }).then(() => interaction.editReply(e.successEmbed(t("youtube_alert.done", { channel_id }))))

            }

            if (status == "disable") {

                await database.updateGuild(guild.id, { $set: { "youtube_alert.isActive": false, "youtube_alert.channel": "null", "youtube_alert.channel_id": "null" } }).then(() => interaction.editReply(e.successEmbed(t("youtube_alert.close"))))

            }

        }
    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("youtube_alert.name", { lng: "tr" })
    },
    options: [
        {
            name: "alert",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("youtube_alert.alert.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("youtube_alert.description", { lng: "tr" })
            },
            options: [
                {
                    name: "status",
                    description: "Please choose what status",
                    name_localizations: {
                        tr: t("welcome.status.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("welcome.status.description", { lng: "tr" })
                    },
                    type: 3,
                    required: true,
                    choices: [
                        { name: "Enable", value: "enable" },
                        { name: "Disable", value: "disable" }
                    ]
                },
                {
                    name: "channel-id",
                    description: "Please enter youtube channel id here",
                    type: 3,
                    name_localizations: {
                        tr: t("youtube_alert.username.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("youtube_alert.username.description", { lng: "tr" })
                    },
                },
                {
                    name: "channel",
                    description: "Please enter youtube announcement channel",
                    name_localizations: {
                        tr: t("youtube_alert.channel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("youtube_alert.channel.description", { lng: "tr" })
                    },
                    type: 7,
                    channel_types: [0]
                },
                {
                    name: "tag",
                    description: "Enter the role to tag",
                    type: 8,
                    name_localizations: {
                        tr: t("youtube_alert.role.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("youtube_alert.role.description", { lng: "tr" })
                    },
                }
            ]
        }
    ]
}