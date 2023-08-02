import { successEmbed, errorEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("welcome.name"),
    description: t("welcome.description"),
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
        const premim = await User.findOne({ user_id: interaction.user.id })

        const status = interaction.options.getString("status")
        const type = interaction.options.getString("type")

        if (status == "enable") {
            
            const welcome_message = interaction.options.getString("welcome-message")
            const by_text = interaction.options.getString("bye-message")
            const channel = interaction.options.getChannel("channel")

            if (!type) return interaction.editReply(errorEmbed(t("welcome.not_type")))
            else if (!welcome_message) return interaction.editReply(errorEmbed(t("welcome.not_welcome_message")))
            else if (!by_text) return interaction.editReply(errorEmbed("welcome.not_bye_message"))
            else if (!channel) return interaction.editReply(errorEmbed("welcome.not_channel"))

            const channels = channel.id
            
            if (type == "text") {

                if (guild?.welcome?.eActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.eActive": false } }, { upsert: true })
                if (guild?.welcome?.pActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.pActive": false } }, { upsert: true })
    
                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.tActive": true, "welcome.welcome_message": welcome_message, "welcome.bye_message": by_text, "welcome.channel": channel.id } }, { upsert: true })
                .then(() => interaction.editReply(successEmbed(t("welcome.create_welcome_message", { channels }))))
    
            }
            else if (type == "embed") {

                if (guild?.welcome?.tActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.tActive": false } }, { upsert: true })
                if (guild?.welcome?.pActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.pActive": false } }, { upsert: true })
    
                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.eActive": true, "welcome.welcome_message": welcome_message, "welcome.bye_message": by_text, "welcome.channel": channel.id } }, { upsert: true })
                .then(() => interaction.editReply(successEmbed(t("welcome.create_welcome_message", { channels }))))

            }
            else if (type == "picture") {

                const picture = interaction.options.getAttachment("picture")?.url

                if (!premim?.premium_active) return interaction.editReply(errorEmbed(t("not_premium", { ns: "common" })))

                if (guild?.welcome?.eActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.eActive": false } }, { upsert: true })
                if (guild?.welcome?.tActive) await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.tActive": false } }, { upsert: true })

                if (!picture) return interaction.editReply(errorEmbed(t("welcome.not_picture")))
                else if (!picture.endsWith(".jpg")) return interaction.editReply(errorEmbed(t("welcome.not_png")))
    
                await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.pActive": true, "welcome.welcome_message": welcome_message, "welcome.bye_message": by_text, "welcome.channel": channel.id, "welcome.picture": picture } }, { upsert: true })
                .then(() => interaction.editReply(successEmbed(t("welcome.create_welcome_message", { channels }))))
    
            }
        }

        else if (status == "disable") {
            await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "welcome.tActive": false, "welcome.eActive": false, "welcome.pActive": false, "welcome.picture": null, "welcome.bye_message": null, "welcome.channel": null, "welcome.welcome_message": null, "welcome.picture": null }}, { upsert: true })
            .then(() => interaction.editReply(successEmbed(t("welcome.close_welcome"))))
        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("welcome.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("welcome.description", { lng: "tr" })
    },
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
            description: "Please select the greeting type",
            name_localizations: {
                tr: t("welcome.type.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("welcome.type.description", { lng: "tr" })
            },
            type: 3,
            choices: [
                { name: "Text", value: "text" },
                { name: "Embed", value: "embed" },
                { name: "Picture", value: "picture" }
            ]
        },
        {
            name: "channel",
            description: "Please specify a welcome channel",
            name_localizations: {
                tr: t("welcome.channel.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("welcome.channel.description", { lng: "tr" })
            },
            type: 7,
            channel_types: [0]
        },
        {
            name: "welcome-message",
            description: "{user} => User, {memberCount} => Number of members on the server, {bottom} => spacing",
            name_localizations: {
                tr: t("welcome.welcome_text.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("welcome.welcome_text.description", { lng: "tr" })
            },
            type: 3,
            min_value: 5,
            max_value: 150,
        },
        {
            name: "bye-message",
            description: "{user} => User, {memberCount} => Number of members on the server, {bottom} => spacing",
            name_localizations: {
                tr: t("welcome.bye_text.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("welcome.bye_text.description", { lng: "tr" })
            },
            type: 3,
            min_value: 5,
            max_value: 150,
        },
        {
            name: "picture",
            description: "Please select an image from your gallery",
            name_localizations: {
                tr: t("welcome.picture.name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("welcome.picture.description", { lng: "tr" })
            },
            type: 11
        }
    ]
}