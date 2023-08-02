import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("special_room.name"),
    description: t("special_room.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const premim = await User.findOne({ user_id: interaction.user.id })

        const { database } = interaction.client

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "room") {

            if (!premim?.premium_active) return interaction.editReply(errorEmbed(t("not_premium", { ns: "common" })))
            
            const status = interaction.options.getString("status")

            if (status == "enable") {

                const channel = interaction.options.getChannel("channel")

                if (!channel) return interaction.editReply(errorEmbed(t("special_room.not_channel")))

                const channel_id = channel.id

                await database.updateGuild(interaction.guild.id, { $set: { "special_room.isActive": true, "special_room.channel": channel.id } }).then(() => interaction.editReply(successEmbed(t("special_room.done", { channel_id }))))
            }

            if (status == "disable") {
                await database.updateGuild(interaction.guild.id, { $set: { "special_room.isActive": false, "special_room.channel": "null" } }).then(() => interaction.editReply(successEmbed(t("special_room.close"))))
            }
        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("special_room.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("special_room.description", { lng: "tr" })
    },
    options: [
        {
            name: "room",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("special_room.room.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("special_room.description", { lng: "tr" })
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
                    name: "channel",
                    description: "Please select a voice channel",
                    name_localizations: {
                        tr: t("special_room.channel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("special_room.channel.description", { lng: "tr" })
                    },
                    type: 7,
                    channel_types: [2]
                }
            ]
        }
    ]
}