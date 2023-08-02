import { EmbedBuilder } from "discord.js"
import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("user_info.name"),
    description: t("user_info.description"),
    async execute(interaction) {

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "info") {

            await interaction.deferReply()

            const select_user = interaction.options.getUser("user")

            const user = await User.findOne({ user_id: select_user.id })

            const premium = (user?.premium_active ? "<:diamond:1126047166750801932>" : "")
            const bug_hunter = (user?.bug_hunter ? "<:bug_hunter:1126051847807967322>" : "")
            const support_team = (user?.support_team ? "<:kalp:1126052254043086910>" : "")
            const sponsor = (user?.sponsor ? "<:support:1126104182022225940>" : "")

            const options = [
                { name: "<:star:1126046723983282276> " + t("user_info.rosette"), value: `> <:user:1126051401513050155> ${premium} ${bug_hunter} ${support_team} ${sponsor}`, inline: false }
            ]

            const users = interaction.options.getUser("user").username

            const Embed = new EmbedBuilder()
            .setAuthor({ name: t("user_info.title", { users }), iconURL: interaction.options.getUser("user").displayAvatarURL() })
            .setFooter({ text: (user?.money?.money.toString() || "0") + " Coin", iconURL: "https://media.discordapp.net/attachments/1109883517778808902/1126181408520536134/coin.png?width=609&height=609" })
            .setColor(process.env.MAIN_COLOR)
            .addFields(options)

            interaction.editReply({ embeds: [Embed] })

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("user_info.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("user_info.description", { lng: "tr" })
    },
    options: [
        {
            name: "info",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("user_info.info_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("user_info.description", { lng: "tr" })
            },
            options: [
                {
                    name: "user",
                    description: "Please select a user",
                    name_localizations: {
                        tr: t("user_info.user_name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("user_info.user_description", { lng: "tr" })
                    },
                    type: 6,
                    required: true
                }
            ]
        }
    ]
}