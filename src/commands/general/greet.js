import { successEmbed, errorEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("greet.name"),
    description: t("greet.description"),
    cooldown: 10,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    async execute(interaction) {

        const premium = await User.findOne({ user_id: interaction.user.id })

        await interaction.deferReply({ ephemeral: true })

        const { e } = interaction.client

        const status = interaction.options.getString("status")

        if (status == "enable") {
            const channels = interaction.options.getString("channel")?.match(/<#(\d{17,19})>/g)?.map(x => interaction.guild.channels.cache.get(x.match(/\d{17,19}/g)?.[0]))?.filter(r => r) || []

            if (!channels.length) return interaction.editReply(errorEmbed(t("greet.not_channel")))
            else if (!channels) return interaction.editReply(errorEmbed(t("greet.not_channel")))
            else if (premium?.premium_active ? channels.length > 10 : channels.length > 5) return interaction.editReply(e.errorEmbed(premium?.premium_active ? t("greet.not_10_channel") : t("greet.not_5_channel") ))

            var array = []

            channels.forEach(channel => {
                array.push(channel.id)
            })

            await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "greet.isActive": true, "greet.channels": array, "lng": interaction.guild.preferredLocale } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("greet.open_system"))))

        }

        if (status == "disable") {
            await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "greet.isActive": false, "greet.channels": [] } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("greet.close_system"))))
        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("greet.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("greet.description", { lng: "tr" })
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
            description: "Please select the channel to tag",
            type: 3,
            name_localizations: {
                tr: t("greet.channel.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("greet.channel.description", { lng: "tr" })
            },
        }
    ]
}