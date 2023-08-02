import { Colors } from "discord.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"

export const data = {
    name: t("user.ban.name"),
    description: t("user.ban.description"),
    permission: ["BanMembers"],
    required_bot_permissions: ["BanMembers"],
    async execute(interaction) {

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "user") {

        await interaction.deferReply({ ephemeral: true })

        const { e, database } = interaction.client

        const guild = await Guild.findOne({ guild_id: interaction.guildId })

        const user = interaction.options.getUser("user")
        const member = interaction.guild.members.fetch(user?.id).catch(() => { })
        const reason = interaction.options.getString("reason") || "not reason"

        const user_id = interaction.user.id
        const user_you = user?.id

        if (user?.id == interaction.user.id) return interaction.editReply(e.errorEmbed(t("user.ban.not_my", { user_id })))

        if (user?.id == interaction.client.user.id) return interaction.editReply(e.errorEmbed(t("user.ban.not_client", { user_id })))

        if ((member?.roles && interaction.member.roles.highest.position <= member?.roles?.highest?.position) && interaction.member.id != interaction.guild.ownerId) return interaction.editReply(e.errorEmbed(t("user.ban.hight_positon", { user_id })))

        const user_control = guild?.ban_members.find(user => user)

        if (user_control?.user.includes(user?.id)) return interaction.editReply(e.successEmbed(t("user.ban.done", { user_id, reason, user_you })))
        else {
        await database.updateGuild(interaction.guild.id, { $push: { "ban_members": { user: user?.id, reason: reason } } }).then(async() => {
            await interaction.guild.members.ban(user, { reason })
            .then(() => {
                interaction.editReply(e.successEmbed(t("user.ban.done", { user_id, reason, user_you })))
            })
        })
    }

    }

    if (sub_command == "info") {

        const user = interaction.options.getUser("user")

        await interaction.deferReply({ ephemeral: true })

        const { e } = interaction.client

        const guild = await Guild.findOne({ guild_id: interaction.guildId })

        if (!guild) return

        const user_reason = guild?.ban_members.find(u => u.user == user?.id)

        const user_id = interaction.user.id
        const user_you = user?.id

        if (!user_reason) return interaction.editReply(e.errorEmbed(t("user.ban.not_user", { user_id })))

        const reason = user_reason?.reason

        interaction.editReply(e.normalEmbed(t("user.ban.user_info", { user_you, reason }), Colors.Red))
    }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("user.ban.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("user.ban.description", { lng: "tr" })
    },
    options: [
        {
            name: "user",
            description: "Allows you to ban the user you specify from the server",
            type: 1,
            name_localizations: {
                tr: t("user.ban.users.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("user.ban.description", { lng: "tr" })
            },
            options: [
                {
                    name: "user",
                    description: "Select the user to be banned from the server",
                    type: 6,
                    required: true,
                    name_localizations: {
                        tr: t("user.ban.user.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("user.ban.user.description", { lng: "tr" })
                    },
                },
                {
                    name: "reason",
                    description: "Enter the reason the user was banned",
                    type: 3,
                    name_localizations: {
                        tr: t("user.ban.reason.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("user.ban.reason.description", { lng: "tr" })
                    },
                },
            ]
        },
        {
            name: "info",
            description: "Shows the user's ban",
            name_localizations: {
                tr: t("user.ban.info.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("user.ban.info.description", { lng: "tr" })
            },
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Select the user to show ban information",
                    type: 6,
                    required: true,
                    name_localizations: {
                        tr: t("user.ban.info_user.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("user.ban.info_user.description", { lng: "tr" })
                    },
                }
            ]
        },
    ]
}