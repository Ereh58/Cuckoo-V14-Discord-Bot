import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"

export const data = {
    name: t("auto.name"),
    description: t("auto.description"),
    cooldown: 20,
    permission: ["ManageRoles"],
    required_bot_permissions: ["ManageRoles"],
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const { guild } = interaction

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "role") {

            const status = interaction.options.getString("status")

            if (status == "enable") {
                const roles = interaction.options.getString("role")?.match(/<@&(\d{17,19})>/g)?.map(x => interaction.guild.roles.cache.get(x.match(/\d{17,19}/g)?.[0]))?.filter(r => r) || []

                const error = roles.filter(role => role.id == guild.roles.everyone.id || role.managed).map(role => role.toString()).join(", ")
                const error_d = roles.filter(role => !role.editable).map(role => role.toString()).join(", ")

                if (!roles.length) return interaction.editReply(errorEmbed(t("auto.error_text.not_role")))
                else if (roles.length && roles.some(r => !r.editable || r.managed)) return interaction.editReply(errorEmbed(t("auto.error_text.not_permission")))
                else if (roles.some(role => (role.id == guild.roles.everyone.id || role.managed))) return interaction.editReply(errorEmbed(t("reaction_role.not_managent", { error })))
                else if (roles.some(role => !role.editable)) return interaction.editReply(errorEmbed(t("reaction_role.not_perm", { error_d })))

                var array = []

                roles.forEach(role => {
                    array.push(role.id)
                })

                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "auto_role.isActive": true, "auto_role.roles": array } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("auto.done_text.auto_role"))))

            }

            if (status == "disable") {
                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "auto_role.isActive": false, "auto_role.roles": [] } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("auto.done_text.auto_role_close"))))
            }

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("auto.name", { lng: "tr" })
    },
    options: [
        {
            name: "role",
            description: "Allows you to set up the autorole system on your server",
            type: 1,
            name_localizations: {
                tr: t("auto.role.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("auto.role.description", { lng: "tr" })
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
                    name: "role",
                    description: "@role @role @role @role",
                    name_localizations: {
                        tr: t("auto.role.role_name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("auto.role.role_description", { lng: "tr" })
                    },
                    type: 3
                }
            ]
        }
    ]
}