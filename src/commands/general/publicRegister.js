import { command_control } from "../../utils/commands/public/command.js"
import { t } from "i18next"

export const data = {
    name: t("public_register.name"),
    description: t("public_register.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    async execute(interaction) {

        try {

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "register") command_control(interaction.options.getString("status"), interaction.options.getChannel("channel")?.id, interaction.options.getRole("man")?.id, interaction.options.getRole("girl")?.id, interaction.options.getRole("unregister")?.id, interaction.options.getRole("admin")?.id, interaction)

        } catch {
            return
        }
    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("public_register.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("public_register.description", { lng: "tr" })
    },
    options: [
        {
            name: "register",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("public_register.register.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("public_register.description", { lng: "tr" })
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
                    name: "uchannel",
                    description: "Please enter a recording channel",
                    name_localizations: {
                        tr: t("public_register.uChannel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("public_register.uChannel.description", { lng: "tr" })
                    },
                    type: 7,
                    channel_types: [0]
                },
                {
                    name: "man",
                    description: "Enter the role to be given to male users",
                    name_localizations: {
                        tr: t("public_register.m_role.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("public_register.m_role.description", { lng: "tr" })
                    },
                    type: 8
                },
                {
                    name: "girl",
                    description: "Enter the role to be assigned to female users",
                    name_localizations: {
                        tr: t("public_register.g_role.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("public_register.g_role.description", { lng: "tr" })
                    },
                    type: 8
                },
                {
                    name: "unregister",
                    description: "Enter unregistered role",
                    name_localizations: {
                        tr: t("public_register.u_role.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("public_register.u_role.description", { lng: "tr" })
                    },
                    type: 8
                },
                {
                    name: "admin",
                    description: "Enter authorized role",
                    name_localizations: {
                        tr: t("public_register.a_role.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("public_register.a_role.description", { lng: "tr" })
                    },
                    type: 8
                }
            ]
        }
    ]
}