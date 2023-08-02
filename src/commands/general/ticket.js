import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, Colors } from "discord.js"
import { successEmbed, errorEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"

export const data = {
    name: t("ticket.name"),
    description: t("ticket.description"),
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

        if (sub_command == "create") {
            
            const status = interaction.options.getString("status")

            if (status == "enable") {

                const channel = interaction.options.getChannel("channel")
                const category = interaction.options.getChannel("category")
                const ticket_count = interaction.options.getString("ticket-count")
                const moderator = interaction.options.getRole("moderator")
                const description = interaction.options.getString("description")
                
                if (!moderator) return interaction.editReply(errorEmbed(t("ticket.not_moderator")))
                else if (!channel) return interaction.editReply(errorEmbed(t("ticket.not_channel")))
                else if (!ticket_count.length) return interaction.editReply(errorEmbed(t("ticket.not_ticket_count")))
                else if (!ticket_count) return interaction.editReply(errorEmbed(t("ticket.not_ticket_count")))
                else if (!category) return interaction.editReply(errorEmbed(t("ticket.not_category")))
                else if (!description) return interaction.editReply(errorEmbed(t("ticket.not_description")))

                const channels = channel.id

                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "ticket.isActive": true, "ticket.ticket_category": category.id, "ticket.ticket_moderator": moderator.id, "ticket.max_ticket_count": (ticket_count == "infiniti" ? 99999 : parseInt(ticket_count)) } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("ticket.done_embed", { channels }))))

                const Embed = new EmbedBuilder()
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL(), url: process.env.SUPPORT_SERVER_INVITE_URL })
                .setThumbnail("https://media.discordapp.net/attachments/1108103947517968455/1130823633317666876/wumpus-q.gif")
                .setDescription(description)
                .setColor(Colors.Blue)

                const row = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                    .setLabel(interaction.guild.name)
                    .setEmoji("🎫")
                    .setCustomId("ticket_open")
                    .setStyle(ButtonStyle.Primary)
                )

                await channel.send({ embeds: [Embed], components: [row] })
            }

            if (status == "disable") {
                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "ticket.isActive": false, "ticket.ticket_category": null, "ticket.ticket_moderator": null, "ticket.max_ticket_count": null } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("ticket.close_embed"))))
            }
        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("ticket.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("ticket.description", { lng: "tr" })
    },
    options: [
        {
            name: "create",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("ticket.create_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("ticket.description", { lng: "tr" })
            },
            options: [
                {
                    name: "status",
                    description: "Please choose what will happen",
                    name_localizations: {
                        tr: t("ticket.status.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("ticket.status.description", { lng: "tr" })
                    },
                    type: 3,
                    required: true,
                    choices: [
                        { name: "Enable", value: "enable" },
                        { name: "Disable", value: "disable" }
                    ]
                },
                {
                    name: "channel",
                    description: "Please specify a welcome channel",
                    name_localizations: {
                        tr: t("ticket.channel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("ticket.channel.description", { lng: "tr" })
                    },
                    type: 7,
                    channel_types: [0]
                },
                {
                    name: "description",
                    description: "Enter ticket description",
                    name_localizations: {
                        tr: t("ticket.descriptions.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("ticket.descriptions.description", { lng: "tr" })
                    },
                    type: 3
                },
                {
                    name: "category",
                    description: "Specify the category in which the ticket channel will open",
                    name_localizations: {
                        tr: t("ticket.category.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("ticket.category.description", { lng: "tr" })
                    },
                    type: 7,
                    channel_types: [4]
                },
                {
                    name: "ticket-count",
                    description: "Specify the maximum number of ticket channels to be opened",
                    type: 3,
                    name_localizations: {
                        tr: t("ticket.ticket_count.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("ticket.ticket_count.description", { lng: "tr" })
                    },
                    choices: [
                        { name: "10", value: "10" },
                        { name: "20", value: "20" },
                        { name: "30", value: "30" },
                        { name: "50", value: "50" },
                        { name: "100", value: "100" },
                        { name: "150", value: "150" },
                        { name: "200", value: "200" },
                        { name: "250", value: "250" },
                        { name: "300", value: "300" },
                        { name: "350", value: "350" },
                        { name: "400", value: "400" },
                        { name: "450", value: "450" },
                        { name: "500", value: "500" },
                        { name: "İnfiniti", value: "infiniti" }
                    ]
                },
                {
                    name: "moderator",
                    description: "Enter ticket authority",
                    type: 8,
                    name_localizations: {
                        tr: t("ticket.ticket_moderator.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("ticket.ticket_moderator.description", { lng: "tr" })
                    },
                }
            ]
        }
    ]
}