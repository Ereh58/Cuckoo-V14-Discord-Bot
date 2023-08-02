import { command_interaction } from "../../utils/commands/memberCount/control.js"
import { t } from "i18next"

export const data = {
    name: t("welcome_member_count.name"),
    description: t("welcome_member_count.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    /**
    * 
    * @param {import("discord.js").ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {
        
        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "member") {

            const status = interaction.options.getString("status")
            const number = interaction.options.getInteger("target-member")

            command_interaction(interaction, status, number)

        }


    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("welcome_member_count.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("welcome_member_count.description", { lng: "tr" })
    },
    options: [
        {
            name: "member",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("welcome_member_count.member.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("welcome_member_count.description", { lng: "tr" })
            },
            options: [
                {
                    name: "status",
                    description: "Please choose what status",
                    name_localizations: {
                        tr: t("welcome_member_count.status.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("welcome_member_count.status.description", { lng: "tr" })
                    },
                    type: 3,
                    required: true,
                    choices: [
                        { name: "Enable", value: "enable" },
                        { name: "Disable", value: "disable" }
                    ]
                },
                {
                    name: "target-member",
                    description: "Enter target number of members",
                    type: 4,
                    min_value: 10,
                    max_value: 1000000,
                    name_localizations: {
                        tr: t("welcome_member_count.target.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("welcome_member_count.target.description", { lng: "tr" })
                    },
                }
            ]
        }
    ]
}