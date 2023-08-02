import { EmbedBuilder } from "discord.js"
import { errorEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"

export const data = {
    name: t("level_user.name"),
    description: t("level_user.description"),
    cooldown: 5,
    /**
    * 
    * @param {import("discord.js").ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const guild = await Guild.findOne({ guild_id: interaction.guildId })

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "level") {

            const users = interaction.options.getUser("user")

            const user = guild?.level_system?.user_id.find((x) => x.user_id == users.id)

            if (!user) return interaction.editReply(errorEmbed(t("level_user.not_user")))

            const Embed = new EmbedBuilder()
            .setAuthor({ name: users.username, iconURL: users.displayAvatarURL() })
            .setTimestamp()
            .setColor(process.env.MAIN_COLOR)
            .addFields(
                { name: "🌟 " + t("level_user.level_level"), value: user.level.toString(), inline: true },
                { name: "✨ " + t("level_user.level_xp"), value: user.xp.toString(), inline: true }
            )

            interaction.editReply({ embeds: [Embed] })

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("level_user.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("level_user.description", { lng: "tr" })
    },
    options: [
        {
            name: "level",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("level_user.user_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("level_user.description", { lng: "tr" })
            },
            options: [
                {
                    name: "user",
                    description: "Please enter a user",
                    name_localizations: {
                        tr: t("level_user.user.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("level_user.user.description", { lng: "tr" })
                    },
                    type: 6,
                    required: true
                }
            ]
        }
    ]
}