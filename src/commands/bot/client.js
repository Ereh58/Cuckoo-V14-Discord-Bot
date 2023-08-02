import { EmbedBuilder } from "discord.js"
import { t } from "i18next"

export const data = {
    name: t("client_information.name"),
    description: t("client_information.description"),
    cooldown: 3,
    async execute(interaction) {

        const owner = `<@${process.env.OWNER_ID}>`
        const uptime = `<t:${Math.floor( Date.now() / 1000 - interaction.client.uptime / 1000)}:R>`
        const guild_count = interaction.client.guilds.cache.size
        const member_count = interaction.client.guilds.cache.reduce((a,b)=> a + b.memberCount, 0)
        const shard = interaction.client.ws.totalShards
        const command = interaction.client.command_count
        const created = `<t:${parseInt((interaction.client.user.createdAt) / 1000)}> (<t:${parseInt((interaction.client.user.createdAt) / 1000)}:R>)`
        const memory = `${(process.memoryUsage().heapUsed / 1024 / 512).toFixed(2)} mb`
        const bot_version = process.env.BOT_VERSION

        const options = [
            { name: t("client_information.embeds.bot_owner"), value: t("client_information.embeds.bot_owner_value", { owner }), inline: true },
            { name: t("client_information.embeds.bot_uptime"), value: t("client_information.embeds.bot_uptime_value", { uptime }), inline: true },
            { name: t("client_information.embeds.bot_memory_usage"), value: t("client_information.embeds.bot_memory_usage_value", { memory }), inline: true },
            { name: t("client_information.embeds.bot_guild_count"), value: t("client_information.embeds.bot_guild_count_value", { guild_count }), inline: true },
            { name: t("client_information.embeds.bot_member_count"), value: t("client_information.embeds.bot_member_count_value", { member_count }), inline: true },
            { name: t("client_information.embeds.bot_shard_count"), value: t("client_information.embeds.bot_shard_count_value", { shard }), inline: true },
            { name: t("client_information.embeds.bot_command_count"), value: t("client_information.embeds.bot_command_count_value", { command }), inline: true },
            { name: t("client_information.embeds.bot_create_date"), value: t("client_information.embeds.bot_create_date_value", { created }), inline: true },
            { name: t("client_information.embeds.bot_version"), value: t("client_information.embeds.bot_version_value", { bot_version }), inline: true }
        ]

        const Embed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
        .addFields(options)
        .setColor(process.env.MAIN_COLOR.toString())

        interaction.reply({ embeds: [Embed] })

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("client_information.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("client_information.description", { lng: "tr" })
    },
    options: [
        {
            name: "stats",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("client_information.information_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("client_information.description", { lng: "tr" })
            },
        }
    ]
}