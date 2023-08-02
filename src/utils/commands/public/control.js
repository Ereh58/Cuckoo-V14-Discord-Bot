import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } from "discord.js"
import { successEmbed, errorEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"

export const member_control = async (member) => {

    const guild_db = await Guild.findOne({ guild_id: member.guild.id })

    if (!guild_db) return
    if (!guild_db?.public_register?.isActive) return

    const member_guard_options_field = [
        { name: t("public_register.member_control.date", { lng: member.guild.preferredLocale }), value: `<t:${parseInt((member.user.createdAt) / 1000)}> (<t:${parseInt((member.user.createdAt) / 1000)}:R>)`, inline: true },
        { name: t("public_register.member_control.verification", { lng: member.guild.preferredLocale }), value: (member.user.createdAt >= 30 ? t("public_register.member_control.verification_t", { lng: member.guild.preferredLocale }) : t("public_register.member_control.verification_f", { lng: member.guild.preferredLocale })), inline: true }
    ]

    const member_embed = new EmbedBuilder()
    .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL(), url: process.env.SUPPORT_SERVER_INVITE_URL })
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(member.user.createdAt >= 30 ? Colors.Green : Colors.Red)
    .addFields(member_guard_options_field)

    const member_button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel(t("public_register.member_control.man_button", { lng: member.guild.preferredLocale }))
        .setStyle(ButtonStyle.Success)
        .setCustomId(`/&/man?${member.id}`),
        new ButtonBuilder()
        .setLabel(t("public_register.member_control.girl_button", { lng: member.guild.preferredLocale }))
        .setStyle(ButtonStyle.Success)
        .setCustomId(`/&/girl?${member.id}`),
        new ButtonBuilder()
        .setLabel(t("public_register.member_control.kick_button", { lng: member.guild.preferredLocale }))
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`/&/kick?${member.id}`)
    )

    await member.roles.add(guild_db?.public_register?.u_role).catch(() => { })
    .then(async () => {
        const uChannel = member.guild.channels.cache.get(guild_db?.public_register?.u_channel)

        if (!uChannel) return

        await uChannel.send({ content: `|| <@&${guild_db?.public_register?.a_role}> **&** <@${member.id}> ||`, embeds: [member_embed], components: [member_button] })
    })

}

export const button_control = async (interaction) => {

    if (!interaction.customId.startsWith("/&/")) return

    const guild_db = await Guild.findOne({ guild_id: interaction.guild.id })

    if (!interaction.member.roles.cache.has(guild_db?.public_register?.a_role)) return interaction.reply(errorEmbed(t("public_register.not_a")))

    const user = interaction.customId.split("?")[1]

    if (interaction.customId == `/&/man?${user}`) {

        const modal = new ModalBuilder()
        .setCustomId(`/+/man?${user}`)
        .setTitle(user.toString())
        .setComponents(
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("name")
                .setLabel(t("public_register.modal.name", { lng: interaction.locale }))
                .setMinLength(1)
                .setMaxLength(30)
                .setPlaceholder("Mucuk")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("age")
                .setLabel(t("public_register.modal.age", { lng: interaction.locale }))
                .setMinLength(1)
                .setMaxLength(2)
                .setPlaceholder("28")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
            )
        )

        interaction.showModal(modal)

    }

    if (interaction.customId == `/&/girl?${user}`) {

        const modal = new ModalBuilder()
        .setCustomId(`/+/girl?${user}`)
        .setTitle(user.toString())
        .setComponents(
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("name")
                .setLabel(t("public_register.modal.name", { lng: interaction.locale }))
                .setMinLength(1)
                .setMaxLength(30)
                .setPlaceholder("Mucuk")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("age")
                .setLabel(t("public_register.modal.age", { lng: interaction.locale }))
                .setMinLength(1)
                .setMaxLength(2)
                .setPlaceholder("28")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
            )
        )

        interaction.showModal(modal)
        
    }

    if (interaction.customId == `/&/kick?${user}`) interaction.message.delete().then(() => interaction.guild.members.kick(interaction.client.users.cache.get(user)).catch(() => { }).then(() => interaction.reply(successEmbed(t("public_register.control.kick_user", { user })))))

}