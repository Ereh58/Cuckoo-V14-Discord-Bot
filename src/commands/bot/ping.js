import { Colors } from "discord.js"
import { t } from "i18next"

export const data = {
    name: t("ping.name"),
    description: t("ping.description"),
    cooldown: 3,
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        await interaction.deferReply()

        const { emoji, ws } = interaction.client

        interaction.editReply({ embeds: [{
            fields: [
                { name: emoji((Date.now() - interaction.createdTimestamp) - ws.ping > 250 ? "high_latency" : "latency_stable") + " " + t("ping.embed.bot_ping"), value: `\`\`\`${(Date.now() - interaction.createdTimestamp) - ws.ping} ms\`\`\``, inline: true },
                { name: emoji(ws.ping > 250 ? "high_latency" : "latency_stable") + " " + t("ping.embed.discord_ping"), value: `\`\`\`${ws.ping} ms\`\`\``, inline: true },
            ],
            color: Colors.DarkButNotBlack
        }]})
        .then((message) => {
            setTimeout(async () => {
                await message.delete()           
            }, 20000);
        })

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("ping.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("ping.description", { lng: "tr" })
    }
}