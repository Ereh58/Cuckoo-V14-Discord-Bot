import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("twitch.name"),
    description: t("twitch.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    async execute(interaction) {

        const sub_command = interaction.options.getSubcommand()
        const premim = await User.findOne({ user_id: interaction.user.id })

        await interaction.deferReply({ ephemeral: true })

        if (sub_command == "alert") {

            if (!premim?.premium_active) return interaction.editReply(errorEmbed(t("not_premium", { ns: "common" })))

            const status = interaction.options.getString("status")

            if (status == "enable") {

                const channel = interaction.options.getChannel("channel")
                const username = interaction.options.getString("username")
                const role = interaction.options.getRole("tag")

                if (!channel) return interaction.editReply(errorEmbed(t("twitch.not_channel")))
                if (!role) return interaction.editReply(e.errorEmbed(t("youtube_alert.not_role")))
                if (!username) return interaction.editReply(errorEmbed(t("twitch.not_user")))
                if (!username.length) return interaction.editReply(errorEmbed(t("twitch.not_user")))

                const channel_id = channel.id

                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "twitch.isActive": true, "twitch.alert_channel": channel.id, "twitch.username": username, "twitch.role": role.id, "lng": interaction.guild.preferredLocale } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("twitch.done", { channel_id }))))

            }

            if (status == "disable") {

                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "twitch.isActive": false, "twitch.alert_channel": "null", "twitch.username": "null" } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("twitch.close"))))

            }

        }
        
    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("twitch.name", { lng: "tr" })
    },
    options: [
        {
            name: "alert",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("twitch.alert.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("twitch.description", { lng: "tr" })
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
                    name: "username",
                    description: "Please enter your twitch username",
                    type: 3,
                    name_localizations: {
                        tr: t("twitch.username.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("twitch.username.description", { lng: "tr" })
                    },
                },
                {
                    name: "channel",
                    description: "Please enter the broadcast announcement channel",
                    name_localizations: {
                        tr: t("twitch.channel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("twitch.channel.description", { lng: "tr" })
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