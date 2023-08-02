import { ModalBuilder, ActionRowBuilder, TextInputBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, TextInputStyle } from "discord.js"
import { errorEmbed, successEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"

export const ticket_request = async (interaction) => {

    try {
    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    if (interaction.customId == "ticket_open") {

        if (!guild?.ticket?.isActive) return

        const modal = new ModalBuilder()
        .setCustomId("ticket_opens")
        .setTitle(interaction.guild.name)
        .setComponents(
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("messages")
                .setLabel(t("ticket.modal", { lng: interaction.locale }))
                .setMinLength(5)
                .setMaxLength(100)
                .setPlaceholder(t("ticket.modal_place", { lng: interaction.locale }))
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
            )
        )

        interaction.showModal(modal)
    }
} catch {
        return
    }
}

export const ticket_response = async (interaction) => {

    try {
    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    if (interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)) return interaction.reply(errorEmbed(t("ticket.have_ticket_error_message", { lng: interaction.locale }))).catch(() => { })

    if (guild?.ticket?.tickets.length >= guild?.ticket?.max_ticket_count) return interaction.reply(errorEmbed(t("ticket.max_ticket_count", { lng: interaction.locale }))).catch(() => { })

    if (!guild?.ticket?.isActive) return

    interaction.guild.channels.create({
        name: interaction.user.username + t("ticket.ticket_name", { lng: interaction.guild.preferredLocale }),
        type: ChannelType.GuildText,
        parent: guild?.ticket?.ticket_category,
        topic: interaction.user.id,
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: interaction.guild.roles.everyone.id,
                deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: guild?.ticket?.ticket_moderator,
                allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Administrator, PermissionFlagsBits.ReadMessageHistory],
            }
        ]
    })
    .then(async (channel) => {
        const channels = `[${interaction.user.username + t("ticket.ticket_name", { lng: interaction.guild.preferredLocale })}](https://discord.com/channels/${interaction.guild.id}/${channel.id})`

        const role = interaction.guild.roles.cache.find(role => role.id == guild?.ticket?.ticket_moderator)

        await Guild.updateOne({ guild_id: interaction.guild.id }, { $push: { "ticket.tickets": { ticket_id: "New Ticket" } } }, { upsert: true })

        const Embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .addFields(
            { name: t("ticket.ticket_opened_user", { lng: interaction.guild.preferredLocale }), value: `<@${interaction.user.id}>`, inline: true },
            { name: t("ticket.ticket_opened_time", { lng: interaction.guild.preferredLocale }), value: `<t:${Math.floor( Date.now() / 1000 )}:R>`, inline: true },
            { name: `**・${t("ticket.ticket_description", { lng: interaction.guild.preferredLocale })}**`, value: `\`\`\`${interaction.fields.getTextInputValue("messages")}\`\`\``, inline: false },
            { name: `${t("ticket.ticket_opened_moderator", { lng: interaction.guild.preferredLocale })}`, value: `<@${role.members.map(member => member.user.id).join(">\n<@")}>`}
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setColor(Colors.Blue)

        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
            .setEmoji("<:ark:1119645426421858344>")
            .setCustomId("ticket_add_user")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setEmoji("<:krimizi:1119748222735364096>")
            .setCustomId("ticket_delete")
            .setStyle(ButtonStyle.Primary)
        )

        await channel.send({ content: `|| <@${interaction.user.id}> **&** <@&${guild?.ticket?.ticket_moderator}> ||`,embeds: [Embed], components: [row] })
        .then((msg) => msg.pin())

        await interaction.deferReply({ ephemeral: true })

        await interaction.editReply(successEmbed(t("ticket.ticket_create_embed", { channels, lng: interaction.locale })))
    })
} catch {
    return
}
}

export const ticket_control = async (interaction) => {
    
    try {
    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    if (interaction.customId == "ticket_delete") {

        if (!interaction.member.roles.cache.has(guild?.ticket?.ticket_moderator)) return interaction.reply(errorEmbed(t("ticket.not_permissions", { lng: interaction.locale })))

        const Embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(t("ticket.close_question", { lng: interaction.guild.preferredLocale }))
        .setColor(Colors.Yellow)

        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
            .setEmoji("<:krimizi:1119748222735364096>")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ticket_close_message_delete"),
            new ButtonBuilder()
            .setEmoji("<:yesil:1119748234940792942>")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ticket_close_ready")
        )

        interaction.reply({ embeds: [Embed], components: [row] })

    }

    if (interaction.customId == "ticket_close_message_delete") interaction.message.delete()

    if (interaction.customId == "ticket_close_ready") {

        if (!interaction.member.roles.cache.has(guild?.ticket?.ticket_moderator)) return interaction.reply(errorEmbed(t("ticket.not_permissions", { lng: interaction.locale })))

        await Guild.updateOne({ guild_id: interaction.guild.id }, { $pop: { "ticket.tickets": -1 } }, { upsert: true })
        .then(async () => {

            await interaction.message.delete()

            const Embed = new EmbedBuilder()
            .setDescription(t("ticket.channel_delete_message", { lng: interaction.guild.preferredLocale }))
            .setColor(Colors.Yellow)

            await interaction.channel.send({ embeds: [Embed] })

            setTimeout(async () => {

                if (interaction.channel) await interaction.channel.delete().catch(() => { })

            }, 3000);
        })
    }

    if (interaction.customId == "ticket_add_user") {

        if (!interaction.member.roles.cache.has(guild?.ticket?.ticket_moderator)) return interaction.reply(errorEmbed(t("ticket.not_permissions", { lng: interaction.locale })))

        const modal = new ModalBuilder()
        .setCustomId("ticket_add_users")
        .setTitle(interaction.guild.name)
        .setComponents(
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId("user")
                .setLabel(t("ticket.user_model", { lng: interaction.locale }))
                .setMinLength(17)
                .setMaxLength(21)
                .setPlaceholder("1107600662721736724")
                .setRequired(true)
                .setStyle("Paragraph")
            )
        )

        interaction.showModal(modal)

    }
} catch {
    return
}

}

export const ticket_add_user = async (interaction) => {
    const user = interaction.fields.getTextInputValue("user")

    if (!user) return interaction.reply(errorEmbed(t("ticket.not_user", { lng: interaction.locale })))

    try {
        const guild = interaction.client.guilds.cache.get(interaction.guild.id)
        const channel = guild.channels.cache.get(interaction.channel.id)
        
        const userId = user
        const users = await guild.members.fetch(userId)
        
        channel.permissionOverwrites.create(users, {
            "SendMessages": true,
            "ViewChannel": true,
            "ReadMessageHistory": true
        })
        .then(() => interaction.reply(successEmbed(t("ticket.done_add_user", { lng: interaction.locale })) ))
        await interaction.channel.send(`<@${user}>`)
        
    } catch {
        interaction.reply(errorEmbed(t("ticket.not_user", { lng: interaction.locale })))
    }
}