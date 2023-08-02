import { errorEmbed, successEmbed } from "../../utils/client/Embed.js"
import { ChannelType, PermissionFlagsBits } from "discord.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"

export const data = {
    name: t("voice.name"),
    description: "Voice",
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["Administrator"],
    /**
    * 
    * @param {import("discord.js").ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const guild = await Guild.findOne({ guild_id: interaction.guildId })

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "panel") {

            const status = interaction.options.getString("status")

            if (status == "enable") {

                const type = interaction.options.getString("type")

                if (!type) return interaction.editReply(errorEmbed(t("voice.not_type")))

                if (type == "member_count") {

                    if (guild?.voice_panel?.active?.member) return interaction.editReply(errorEmbed(t("voice.not_panel")))

                    interaction.guild.channels.create({
                        name: "👥 Total Member: " + interaction.guild.memberCount,
                        type: ChannelType.GuildVoice,
                        permissionOverwrites: [ { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.Connect] } ]
                    }).then(async (channel) => {
                        await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "voice_panel.active.member": true, "voice_panel.channel.member": channel.id } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("voice.member_done_embed"))))
                    })
                }

            }

            if (status == "disable") {

                const type = interaction.options.getString("type")

                if (!type) return interaction.editReply(errorEmbed(t("voice.not_type")))

                if (type == "member_count") {

                    if (!guild?.voice_panel?.active?.member) return interaction.editReply(errorEmbed(t("voice.not_close_panel")))

                    await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "voice_panel.active.member": false, "voice_panel.channel.member": "Not Channel :D" } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("voice.member_done_embed_close"))))
                }

            }

        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("voice.name", { lng: "tr" })
    },
    options: [
        {
            name: "panel",
            description: data.description,
            name_localizations: {
                tr: t("voice.panel_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("voice.panel_description", { lng: "tr" })
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
                    description: "Please enter sound panel type",
                    name_localizations: {
                        tr: t("welcome.type.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("voice.type.description", { lng: "tr" })
                    },
                    type: 3,
                    choices: [
                        { name: "Total Count", value: "member_count" }
                    ]
                }
            ]
        }
    ]
}