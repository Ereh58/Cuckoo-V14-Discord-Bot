import { successEmbed } from "../../utils/client/Embed.js"
import { Colors, EmbedBuilder } from "discord.js"
import { t } from "i18next"

export const data = {
    name: t("report.name"),
    description: t("report.description"),
    cooldown: 300,
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "send") {
            const channel = interaction.client.channels.cache.get(process.env.REPORT_CHANNEL)

            const report_text = interaction.options.getString("report-text")
            const picture = interaction.options.getAttachment("picture")?.url

            const Embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`\`\`\`${report_text}\`\`\``)
            .setImage(picture || "https://media.discordapp.net/attachments/1111945233941409833/1118979796085506188/do-not-take-photos-1576438_960_720.png?width=610&height=609")
            .setColor(Colors.Red)
            .setFooter({ text: `${interaction.user.username}(${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })

            channel.send({ embeds: [Embed] }).catch(() => { })

            interaction.reply(successEmbed(t("report.send_embed")))

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("report.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("report.description", { lng: "tr" })
    },
    options: [
        {
            name: "send",
            description: data.description,
            name_localizations: {
                tr: t("report.send_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("report.description", { lng: "tr" })
            },
            type: 1,
            options: [
                {
                    name: "report-text",
                    description: "What were you doing when you got this error?",
                    type: 3,
                    min_value: 1,
                    max_value: 400,
                    required: true,
                    name_localizations: {
                        tr: t("report.report_text.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("report.report_text.description", { lng: "tr" })
                    },
                },
                {
                    name: "picture",
                    description: "Please enter an image related to the error",
                    type: 11,
                    required: true,
                    name_localizations: {
                        tr: t("report.image.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("report.image.description", { lng: "tr" })
                    },
                }
            ]
        }
    ]
}