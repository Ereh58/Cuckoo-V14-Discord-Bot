import { TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder } from "discord.js"
import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("level_system.name"),
    description: t("level_system.description"),
    cooldown: 10,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        const guild = await Guild.findOne({ guild_id: interaction.guildId })

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "system") {

            await interaction.deferReply({ ephemeral: true })

            const status = interaction.options.getString("status")

            if (status == "enable") {

                const type = interaction.options.getString("type")
                const text = interaction.options.getString("text")
                const channel = interaction.options.getChannel("channel")

                if (!type) return interaction.editReply(errorEmbed(t("level_system.not_type")))
                if (!text) return interaction.editReply(errorEmbed(t("level_system.not_text")))
                if (!channel) return interaction.editReply(errorEmbed(t("level_system.not_channel")))

                if (text.length >= 200) return interaction.editReply(errorEmbed(t("level_system.not_text_length")))

                if (type == "text") {

                    if (guild?.level_system?.eActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "level_system.eActive": false } }, { upsert: true })

                    await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "level_system.tActive": true, "level_system.channel": channel.id, "level_system.level_message": text } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("level_system.open_embed_message"))))
                }

                if (type == "embed") {

                    if (guild?.level_system?.tActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "level_system.tActive": false } }, { upsert: true })

                    await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "level_system.eActive": true, "level_system.channel": channel.id, "level_system.level_message": text } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("level_system.open_embed_message"))))
                }
 
            }

            if (status == "disable") {

                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "level_system.tActive": false, "level_system.eActive": false, "level_system.level_message": null, "level_system.picture": null, "level_system.channel": null } }, { upsert: true })
                .then(() => interaction.editReply(successEmbed(t("level_system.close_embed_message"))))

            }
        }

        if (sub_command == "role") {

            const user = await User.findOne({ user_id: interaction.user.id })

            if (!user?.premium_active) return interaction.editReply(errorEmbed(t("not_premium", { ns: "common" })))

            const modal = new ModalBuilder()
            .setCustomId("level_role_select")
            .setTitle(interaction.guild.name)
            .setComponents(
                new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                    .setCustomId("level")
                    .setLabel(t("level_system.role_level"))
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setPlaceholder("1, 2, 3, 4, 5...")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                    .setCustomId("role")
                    .setLabel(t("level_system.role_role"))
                    .setMinLength(18)
                    .setMaxLength(20)
                    .setPlaceholder("1120452661418934443")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
    
            interaction.showModal(modal)

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("level_system.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("level_system.description", { lng: "tr" })
    },
    options: [
        {
            name: "system",
            description: data.description,
            name_localizations: {
                tr: t("level_system.system_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("level_system.description", { lng: "tr" })
            },
            type: 1,
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
                    name: "type",
                    description: "Please select level message type",
                    name_localizations: {
                        tr: t("level_system.type.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("level_system.type.description", { lng: "tr" })
                    },
                    type: 3,
                    choices: [
                        { name: "Text", value: "text" },
                        { name: "Embed", value: "embed" }
                    ]
                },
                {
                    name: "text",
                    description: "{user} => user, {level} => User's level",
                    type: 3,
                    name_localizations: {
                        tr: t("level_system.text.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("level_system.text.description", { lng: "tr" })
                    }
                },
                {
                    name: "channel",
                    description: "Enter channel",
                    type: 7,
                    channel_types: [0],
                    name_localizations: {
                        tr: t("level_system.channel.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("level_system.channel.description", { lng: "tr" })
                    }
                }
            ]
        },
        {
            name: "role",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("level_system.role_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("level_system.role_description", { lng: "tr" })
            },
        }
    ]
}