import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, StringSelectMenuBuilder } from "discord.js"
import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"

export const data = {
    name: t("reaction_role.name"),
    description: t("reaction_role.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const { guild } = interaction

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "role") {

            const choices = interaction.options.getString("choices")
            const role = interaction.options.getString("role")?.match(/<@&\d{17,20}>/g).map(role => interaction.guild.roles.cache.get(role.replace(/<@&|>/g, "")))
            const text = interaction.options.getString("text")
            const channel = interaction.options.getChannel("channel")

            const error = role.filter(role => role.id == guild.roles.everyone.id || role.managed).map(role => role.toString()).join(", ")
            const error_d = role.filter(role => !role.editable).map(role => role.toString()).join(", ")

            if (!role.length) return interaction.editReply(errorEmbed(t("reaction_role.not_role")))
            else if (role.length > 25) return interaction.editReply(errorEmbed(t("reaction_role.not_role_length")))
            else if (role.some(role => (role.id == guild.roles.everyone.id || role.managed))) return interaction.editReply(errorEmbed(t("reaction_role.not_managent", { error })))
            else if (role.some(role => !role.editable)) return interaction.editReply(errorEmbed(t("reaction_role.not_perm", { error_d })))
            else if (!channel) return interaction.editReply(errorEmbed(t("reaction_role.not_channel")))

            var components = []

            if (choices == "select_menu") {
                components.push(new ActionRowBuilder().setComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId("/reaction/+/select/")
                    .setPlaceholder("👆🏻")
                    .setMinValues(0)
                    .setMaxValues(role.length)
                    .setOptions(role.map(role => ({ label: role.name, value: role.id })))
                ))
            }

            if (choices == "buttons") {
                role.forEach(role => {
                    const button = new ButtonBuilder()
                    .setCustomId(`/reaction/+/button/${role.id}`)
                    .setLabel(role.name)
                    .setStyle(ButtonStyle.Secondary)

                    if (((components[components.length - 1]?.components?.length || 0) == 5) || components.length == 0) components.push(
                        new ActionRowBuilder()
                            .setComponents(button)
                    )

                    else components[components.length - 1].addComponents(button)
                })
            }

            const reaction_embed = new EmbedBuilder()
            .setDescription(text)
            .setColor(Colors.Blue)
            .setThumbnail("https://media.discordapp.net/attachments/1119025151292489839/1130866769779773521/wumpus.gif")
            .setAuthor({ name: guild.name, iconURL: guild.iconURL(), url: process.env.SUPPORT_SERVER_INVITE_URL })

            channel.send({ embeds: [reaction_embed], components }).then(() => interaction.editReply(successEmbed(t("reaction_role.done")))).then(async () => {
                await interaction.client.database.updateGuild(interaction.guild.id, { $set: { "reaction_role.isActive": true } })
            })

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("reaction_role.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("reaction_role.description", { lng: "tr" })
    },
    options: [
        {
            name: "role",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("reaction_role.role.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("reaction_role.description", { lng: "tr" })
            },
            options: [
                {
                    name: "choices",
                    description: "Please enter a reaction type",
                    name_localizations: {
                        tr: t("reaction_role.choices.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("reaction_role.choices.description", { lng: "tr" })
                    },
                    type: 3,
                    required: true,
                    choices: [
                        { name: "Select Menu", value: "select_menu" },
                        { name: "Buttons", value: "buttons" }
                    ]
                },
                {
                    name: "channel",
                    description: "Select the channel to send the message to",
                    name_localizations: {
                        tr: t("reaction_role.channel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("reaction_role.channel.description", { lng: "tr" })
                    },
                    type: 7,
                    channel_types: [0]
                },
                {
                    name: "role",
                    description: "@role1, @role2",
                    name_localizations: {
                        tr: t("reaction_role.roles.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("reaction_role.roles.description", { lng: "tr" })
                    },
                    type: 3
                },
                {
                    name: "text",
                    description: "Please type the text that will appear in the embed",
                    name_localizations: {
                        tr: t("reaction_role.text.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("reaction_role.text.description", { lng: "tr" })
                    },
                    type: 3
                }
            ]
        }
    ]
}