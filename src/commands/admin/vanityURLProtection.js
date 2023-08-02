import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import Guild from "../../utils/database/schema/guild.js"
import { t } from "i18next"

export const data = {
    name: t("vanity_url.name"),
    description: t("vanity_url.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "guard") {

            const options = interaction.options.getString("status")
    
            if (options == "enable") {

                const channel = interaction.options.getChannel("control-channel")
                
                if (!channel) return interaction.editReply(errorEmbed(t("vanity_url.not_channel")))
                await Guild.updateOne({ guild_id: interaction.guildId }, { $set: { "vanityURLProtection.isActive": true, "vanityURLProtection.channel": channel.id }}, { upsert: true }).then(() => interaction.editReply(successEmbed(t("vanity_url.open_embed", { channel }))))
            }
    
            if (options == "disable") await Guild.updateOne({ guild_id: interaction.guildId }, { $set: { "vanityURLProtection.isActive": false, "vanityURLProtection.channel": null }}, { upsert: true }).then(() => interaction.editReply(successEmbed(t("vanity_url.close_embed"))))

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("vanity_url.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("vanity_url.description", { lng: "tr" })
    },
    options: [
        {
            name: "guard",
            description: data.description,
            name_localizations: {
                tr: t("vanity_url.sub_command", { lng: "tr" })
            },
            description_localizations: {
                tr: t("vanity_url.description", { lng: "tr" })
            },
            type: 1,
            options: [
                {
                    name: "status",
                    description: "Please choose what status",
                    type: 3,
                    required: true,
                    name_localizations: {
                        tr: t("vanity_url.status.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("vanity_url.status.description", { lng: "tr" })
                    },
                    choices: [
                        { name: "Enable", value: "enable" },
                        { name: "Disable", value: "disable" }
                    ]
                },
                {
                    name: "control-channel",
                    description: "Set URL notification channel",
                    name_localizations: {
                        tr: t("vanity_url.control_channel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("vanity_url.control_channel.description", { lng: "tr" })
                    },
                    type: 7,
                    channel_types: [0]
                }
            ]
        }
    ]
}