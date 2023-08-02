import { successEmbed, errorEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("rosette.name"),
    description: t("premium.description"),
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        if (interaction.user.id !== process.env.OWNER_ID) return interaction.editReply(errorEmbed(t("premium.error_message")))

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "add") {
            const user = interaction.options.getUser("user")
            const rosette = interaction.options.getString("rosette")

            const user_db = await User.findOne({ user_id: user.id })

            if (rosette == "bug_hunter") {
                if (user_db?.bug_hunter) return interaction.editReply(errorEmbed(t("rosette.have_user")))
                await User.updateOne({ user_id: user.id }, { $set: { "bug_hunter": true } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("rosette.add_rosette"))))
            }

            if (rosette == "support_team") {
                if (user_db?.support_team) return interaction.editReply(errorEmbed(t("rosette.have_user")))
                await User.updateOne({ user_id: user.id }, { $set: { "support_team": true } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("rosette.add_rosette"))))
            }

            if (rosette == "sponsor") {
                if (user_db?.sponsor) return interaction.editReply(errorEmbed(t("rosette.have_user")))
                await User.updateOne({ user_id: user.id }, { $set: { "sponsor": true } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("rosette.remove_rosette"))))
            }
        }

        if (sub_command == "remove") {
            const user = interaction.options.getUser("user")
            const rosette = interaction.options.getString("rosette")

            if (rosette == "bug_hunter") {
                if (!user_db?.bug_hunter) return interaction.editReply(errorEmbed(t("rosette.have_user")))
                await User.updateOne({ user_id: user.id }, { $set: { "bug_hunter": false } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("rosette.remove_rosette"))))
            }

            if (rosette == "support_team") {
                if (!user_db?.support_team) return interaction.editReply(errorEmbed(t("rosette.have_user")))
                await User.updateOne({ user_id: user.id }, { $set: { "support_team": false } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("rosette.remove_rosette"))))
            }

            if (rosette == "sponsor") {
                if (!user_db?.sponsor) return interaction.editReply(errorEmbed(t("rosette.have_user")))
                await User.updateOne({ user_id: user.id }, { $set: { "sponsor": false } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("rosette.remove_rosette"))))
            }
        }


    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("rosette.name", { lng: "tr" })
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
                    name: "rosette",
                    description: data.description,
                    required: true,
                    type: 3,
                    name_localizations: {
                        tr: t("rosette.rosette.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("premium.description", { lng: "tr" })
                    },
                    choices: [
                        { name: "Bug Hunter", value: "bug_hunter" },
                        { name: "Support Team", value: "support_team" },
                        { name: "Sponsor", value: "sponsor" }
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
                },
                {
                    name: "rosette",
                    description: data.description,
                    required: true,
                    type: 3,
                    name_localizations: {
                        tr: t("rosette.rosette.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("premium.description", { lng: "tr" })
                    },
                    choices: [
                        { name: "Bug Hunter", value: "bug_hunter" },
                        { name: "Support Team", value: "support_team" },
                        { name: "Sponsor", value: "sponsor" }
                    ]
                }
            ]
        },
    ]
}