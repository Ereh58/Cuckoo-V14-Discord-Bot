import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"

export const data = {
    name: t("user.unban.name"),
    description: t("user.unban.description"),
    permission: ["BanMembers"],
    required_bot_permissions: ["BanMembers"],
    async execute(interaction) {

        const { e } = interaction.client
        const { guild } = interaction

        const sub_command = interaction.options.getSubcommand()

        await interaction.deferReply({ ephemeral: true })

        const guild_db = await Guild.findOne({ guild_id: interaction.guild.id })

        if (sub_command == "ban") {

            const user = interaction.options.getUser("user")
            if (!user) return

            const user_control = guild_db?.ban_members?.find(user => user)
            const user_ = user?.id

            if (user?.id == interaction.user.id) return interaction.editReply(e.errorEmbed(t("user.ban.not_my", { user_ })))

            if (user?.id == interaction.client.user.id) return interaction.editReply(e.errorEmbed(t("user.ban.not_client", { user_ })))

            if (!user_control?.user.includes(user?.id)) return await guild.members.unban(user?.id).then(() => interaction.editReply(e.successEmbed(t("user.unban.done_unban", { user_ }))))
            else {
                await Guild.updateOne({ guild_id: interaction.guild.id }, { $pull: { "ban_members": { user: user?.id } } }, { upsert: true })
                .then(async () => {
                    await guild.members.unban(user?.id).then(() => interaction.editReply(e.successEmbed(t("user.unban.done_unban", { user_ }))))
                })
            }
        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("user.unban.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("user.unban.description", { lng: "tr" })
    },
    options: [
        {
            name: "ban",
            description: "Removes the user's ban from the server",
            type: 1,
            name_localizations: {
                tr: t("user.unban.unban.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("user.unban.description", { lng: "tr" })
            },
            options: [
                {
                    name: "user",
                    description: "Removes the user's ban from the server",
                    type: 6,
                    required: true,
                    name_localizations: {
                        tr: t("user.unban.user.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("user.unban.user.description", { lng: "tr" })
                    },
                }
            ]
        }
    ]
}