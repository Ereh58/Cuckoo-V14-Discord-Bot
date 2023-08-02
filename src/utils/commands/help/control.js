import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, PermissionFlagsBits } from "discord.js"
import { errorEmbed, successEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import User from "../../database/schema/user.js"
import Guild from "../../database/schema/guild.js"

export const help_control = async (interaction) => {

    if (interaction.customId == "return_system"+interaction.user.id) {

        const on = "<:on:1121786054656151742>"
        const close ="<:off:1121786160054800485>"
        
        const user = await User.findOne({ user_id: interaction.user.id })

        const guild = await Guild.findOne({ guild_id: interaction.guildId })

        const welcome = (guild?.welcome?.tActive || guild?.welcome?.eActive || guild?.welcome?.pActive == true ? on : close)
        const vanityURLProtection = (guild?.vanityURLProtection?.isActive == true ? on : close)
        const advertisingBlock = (guild?.advertising_block?.isActive == true ? on : close)
        const ticket = (guild?.ticket?.isActive == true ? on : close)
        const memberCount = (guild?.member_count?.isActive == true ? on : close)
        const level_system = (guild?.level_system?.tActive || guild?.level_system?.eActive || guild?.level_system?.pActive == true ? on : close)
        const auto_role = (guild?.auto_role?.isActive ? on : close)
        const voice_panel = (guild?.voice_panel?.active?.member ? on : close)
        const greet = (guild?.greet?.isActive ? on : close)
        const twitch = (guild?.twitch?.isActive ? on : close)
        const public_register = (guild?.public_register?.isActive ? on : close)
        const special_room = (guild?.special_room?.isActive ? on : close)
        const youtube_alert = (guild?.youtube_alert?.isActive ? on : close)
        const reaction_role = (guild?.reaction_role?.isActive ? on : close)

        const options = [
            { name: "👋 " + t("settings.embed.welcome"), value: welcome, inline: true },
            { name: "🦴 " + t("settings.embed.vanity_url"), value: vanityURLProtection, inline: true },
            { name: "🛡️ " + t("settings.embed.advertising"), value: advertisingBlock, inline: true },
            { name: "🎫 " + t("settings.embed.ticket"), value: ticket, inline: true },
            { name: "👥 " + t("settings.embed.member_count"), value: memberCount, inline: true },
            { name: "✨ " + t("settings.embed.level_system"), value: level_system, inline: true },
            { name: "🎯 " + t("settings.embed.auto_role"), value: auto_role, inline: true },
            { name: "🔉 " + t("settings.embed.voice_panel"), value: voice_panel, inline: true },
            { name: "👌 " + t("help.command.greet").replaceAll("/", ""), value: greet, inline: true },
            { name: "🔔 " + t("help.command.twitch").replaceAll("/", ""), value: twitch, inline: true },
            { name: "📌 " + t("help.command.public_register").replaceAll("/", ""), value: public_register, inline: true },
            { name: "🧐 " + t("help.command.special_room").replaceAll("/", ""), value: special_room, inline: true },
            { name: "🔔 " + t("help.command.youtube_alert").replaceAll("/", ""), value: youtube_alert, inline: true },
            { name: "👆🏻 " + t("help.command.reaction_role").replace("/", ""), value: reaction_role, inline: true }
        ]

        const help_embed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setColor(process.env.MAIN_COLOR)
        .addFields(options)

        const select_options = []

        if (guild?.welcome?.tActive || guild?.welcome?.eActive || guild?.welcome?.pActive) {
            select_options.push({ label: t("settings.embed.welcome"), value: "welcome"+interaction.user.id, emoji: "👋" })
        }

        if (guild?.vanityURLProtection?.isActive) {
            select_options.push({ label: t("settings.embed.vanity_url"), value: "url"+interaction.user.id, emoji: "🦴" })
        }

        if (guild?.ticket?.isActive) {
            select_options.push({ label: t("settings.embed.ticket"), value: "ticket"+interaction.user.id, emoji: "🎫" })
        }

        if (guild?.member_count?.isActive) {
            select_options.push({ label: t("settings.embed.member_count"), value: "member_count"+interaction.user.id, emoji: "👥" })
        }

        if (guild?.level_system?.tActive || guild?.level_system?.eActive) {
            select_options.push({ label: t("settings.embed.level_system"), value: "level"+interaction.user.id, emoji: "✨"})
        }

        if (guild?.auto_role?.isActive) {
            select_options.push({ label: t("settings.embed.auto_role"), value: "auto_role"+interaction.user.id, emoji: "🎯"})
        }

        if (guild?.voice_panel?.active?.member) {
            select_options.push({ label: t("settings.embed.voice_panel"), value: "voice"+interaction.user.id, emoji: "🔉"})
        }

        if (guild?.greet?.isActive) {
            select_options.push({ label: t("help.command.greet").replaceAll("/", ""), value: "greet"+interaction.user.id, emoji: "👌"})
        }

        if (guild?.twitch?.isActive) {
            select_options.push({ label: t("help.command.twitch").replaceAll("/", ""), value: "twitch"+interaction.user.id, emoji: "🔔" })
        }

        if (guild?.public_register?.isActive) {
            select_options.push({ label: t("help.command.public_register").replaceAll("/", ""), value: "public"+interaction.user.id, emoji: "📌" })
        }

        if (guild?.special_room?.isActive) {
            select_options.push({ label: t("help.command.special_room").replaceAll("/", ""), value: "special"+interaction.user.id, emoji: "🧐" })
        }

        if (guild?.youtube_alert?.isActive) {
            select_options.push({ label: t("help.command.youtube_alert").replace("/", ""), value: "youtube"+interaction.user.id, emoji: "🔔" })
        }

        const select_menu = new ActionRowBuilder()
        .setComponents(
            new StringSelectMenuBuilder()
            .setCustomId("help_select_menu")
            .setPlaceholder("⚙️")
            .addOptions(select_options)
            .setDisabled(false)
        )

const help_button = new ActionRowBuilder()
.setComponents(
    new ButtonBuilder()
    .setEmoji("<:coin:1126122797425508352>")
    .setLabel(`${user?.money?.money || 0} / 250`)
    .setStyle(ButtonStyle.Primary)
    .setCustomId("null")
    .setDisabled(true),
    new ButtonBuilder()
    .setEmoji("<:diamond:1126047166750801932>")
    .setLabel("Premium")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
    .setDisabled(false),
    new ButtonBuilder()
    .setEmoji("<:carpi:1119645460265717949>")
    .setStyle(ButtonStyle.Danger)
    .setCustomId("return_premium"+interaction.user.id)
    .setDisabled(false),
)

const not_button = new ActionRowBuilder()
.setComponents(
    new ButtonBuilder()
    .setEmoji("<:coin:1126122797425508352>")
    .setLabel(`${user?.money?.money || 0}`)
    .setStyle(ButtonStyle.Primary)
    .setCustomId("null")
    .setDisabled(true),
    new ButtonBuilder()
    .setEmoji("<:carpi:1119645460265717949>")
    .setStyle(ButtonStyle.Danger)
    .setCustomId("return_premium"+interaction.user.id)
    .setDisabled(false),
)

if (!select_options.length) {
    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })
} else {
    interaction.update({ embeds: [help_embed], components: [select_menu, (user?.premium_active ? not_button : help_button)] })
}

    }

    if (interaction.customId == "help_select_menu") {
        let choice = interaction.values[0]

        if (choice == "premium"+interaction.user.id) {

            const on = "<:on:1121786054656151742>"
            const close ="<:off:1121786160054800485>"
    
            const user = await User.findOne({ user_id: interaction.user.id })
            const guild = await Guild.findOne({ guild_id: interaction.guildId })
    
            const welcome = (guild?.welcome?.tActive || guild?.welcome?.eActive || guild?.welcome?.pActive == true ? on : close)
            const twitch = (guild?.twitch?.isActive ? on : close)
            const public_register = (guild?.public_register?.isActive ? on : close)
            const special_room = (guild?.special_room?.isActive ? on : close)
            const youtube_alert = (guild?.youtube_alert?.isActive ? on : close)
            const greeting = (guild?.greet?.isActive ? on : close)
    
            const field_options = [
                { name: "👋 " + t("settings.embed.welcome"), value: welcome, inline: true },
                { name: "🔔 " + t("help.command.twitch").replaceAll("/", ""), value: twitch, inline: true },
                { name: "📌 " + t("help.command.public_register").replaceAll("/", ""), value: public_register, inline: true },
                { name: "🧐 " + t("help.command.special_room").replaceAll("/", ""), value: special_room, inline: true },
                { name: "👌 " + t("help.command.greet_pre").replace("/", ""), value: greeting, inline: true },
                { name: "🔔 " + t("help.command.youtube_alert").replaceAll("/", ""), value: youtube_alert, inline: true }
            ]
        
            const help_embed = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor(process.env.MAIN_COLOR)
            .addFields(field_options)

            const select_options = []

            if (guild?.welcome?.pActive) {
                select_options.push({ label: t("settings.embed.welcome"), value: "welcome"+interaction.user.id, emoji: "👋" })
            }
    
            if (guild?.greet?.isActive) {
                select_options.push({ label: t("help.command.greet_pre").replace("/", ""), value: "greet"+interaction.user.id, emoji: "👌"})
            }
    
            if (guild?.twitch?.isActive) {
                select_options.push({ label: t("help.command.twitch").replaceAll("/", ""), value: "twitch"+interaction.user.id, emoji: "🔔" })
            }
    
            if (guild?.public_register?.isActive) {
                select_options.push({ label: t("help.command.public_register").replaceAll("/", ""), value: "public"+interaction.user.id, emoji: "📌" })
            }
    
            if (guild?.special_room?.isActive) {
                select_options.push({ label: t("help.command.special_room").replaceAll("/", ""), value: "special"+interaction.user.id, emoji: "🧐" })
            }
    
            if (guild?.youtube_alert?.isActive) {
                select_options.push({ label: t("help.command.youtube_alert").replace("/", ""), value: "youtube"+interaction.user.id, emoji: "🔔" })
            }
    
            const select_menu = new ActionRowBuilder()
            .setComponents(
                new StringSelectMenuBuilder()
                .setCustomId("help_select_menu")
                .setPlaceholder("⚙️")
                .addOptions(select_options)
                .setDisabled(false)
            )
        
            const help_button = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setEmoji("<:coin:1126122797425508352>")
                .setLabel(`${user?.money?.money || 0} / 250`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId("null")
                .setDisabled(true),
                new ButtonBuilder()
                .setEmoji("<:diamond:1126047166750801932>")
                .setLabel("Premium")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
                .setDisabled(false),
                new ButtonBuilder()
                .setEmoji("<:carpi:1119645460265717949>")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("return_premium"+interaction.user.id)
                .setDisabled(false),
            )
        
            const not_button = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setEmoji("<:coin:1126122797425508352>")
                .setLabel(`${user?.money?.money || 0}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId("null")
                .setDisabled(true),
                new ButtonBuilder()
                .setEmoji("<:carpi:1119645460265717949>")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("return_premium"+interaction.user.id)
                .setDisabled(false),
            )
        
            if (!select_options.length) {
                interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })
            } else {
                interaction.update({ embeds: [help_embed], components: [select_menu, (user?.premium_active ? not_button : help_button)] })
            }
    
        }

        if (choice == "all_command"+interaction.user.id) {

            const on = "<:on:1121786054656151742>"
            const close ="<:off:1121786160054800485>"
            
            const user = await User.findOne({ user_id: interaction.user.id })
    
            const guild = await Guild.findOne({ guild_id: interaction.guildId })
    
            const welcome = (guild?.welcome?.tActive || guild?.welcome?.eActive || guild?.welcome?.pActive == true ? on : close)
            const vanityURLProtection = (guild?.vanityURLProtection?.isActive == true ? on : close)
            const advertisingBlock = (guild?.advertising_block?.isActive == true ? on : close)
            const ticket = (guild?.ticket?.isActive == true ? on : close)
            const memberCount = (guild?.member_count?.isActive == true ? on : close)
            const level_system = (guild?.level_system?.tActive || guild?.level_system?.eActive || guild?.level_system?.pActive == true ? on : close)
            const auto_role = (guild?.auto_role?.isActive ? on : close)
            const voice_panel = (guild?.voice_panel?.active?.member ? on : close)
            const greet = (guild?.greet?.isActive ? on : close)
            const twitch = (guild?.twitch?.isActive ? on : close)
            const public_register = (guild?.public_register?.isActive ? on : close)
            const special_room = (guild?.special_room?.isActive ? on : close)
            const youtube_alert = (guild?.youtube_alert?.isActive ? on : close)
            const reaction_role = (guild?.reaction_role?.isActive ? on : close)
    
            const options = [
                { name: "👋 " + t("settings.embed.welcome"), value: welcome, inline: true },
                { name: "🦴 " + t("settings.embed.vanity_url"), value: vanityURLProtection, inline: true },
                { name: "🛡️ " + t("settings.embed.advertising"), value: advertisingBlock, inline: true },
                { name: "🎫 " + t("settings.embed.ticket"), value: ticket, inline: true },
                { name: "👥 " + t("settings.embed.member_count"), value: memberCount, inline: true },
                { name: "✨ " + t("settings.embed.level_system"), value: level_system, inline: true },
                { name: "🎯 " + t("settings.embed.auto_role"), value: auto_role, inline: true },
                { name: "🔉 " + t("settings.embed.voice_panel"), value: voice_panel, inline: true },
                { name: "👌 " + t("help.command.greet").replaceAll("/", ""), value: greet, inline: true },
                { name: "🔔 " + t("help.command.twitch").replaceAll("/", ""), value: twitch, inline: true },
                { name: "📌 " + t("help.command.public_register").replaceAll("/", ""), value: public_register, inline: true },
                { name: "🧐 " + t("help.command.special_room").replaceAll("/", ""), value: special_room, inline: true },
                { name: "🔔 " + t("help.command.youtube_alert").replaceAll("/", ""), value: youtube_alert, inline: true },
                { name: "👆🏻 " + t("help.command.reaction_role").replace("/", ""), value: reaction_role, inline: true }
            ]
    
            const help_embed = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor(process.env.MAIN_COLOR)
            .addFields(options)

            const select_options = []

            if (guild?.welcome?.tActive || guild?.welcome?.eActive || guild?.welcome?.pActive) {
                select_options.push({ label: t("settings.embed.welcome"), value: "welcome"+interaction.user.id, emoji: "👋" })
            }

            if (guild?.vanityURLProtection?.isActive) {
                select_options.push({ label: t("settings.embed.vanity_url"), value: "url"+interaction.user.id, emoji: "🦴" })
            }

            if (guild?.ticket?.isActive) {
                select_options.push({ label: t("settings.embed.ticket"), value: "ticket"+interaction.user.id, emoji: "🎫" })
            }

            if (guild?.member_count?.isActive) {
                select_options.push({ label: t("settings.embed.member_count"), value: "member_count"+interaction.user.id, emoji: "👥" })
            }

            if (guild?.level_system?.tActive || guild?.level_system?.eActive) {
                select_options.push({ label: t("settings.embed.level_system"), value: "level"+interaction.user.id, emoji: "✨"})
            }

            if (guild?.auto_role?.isActive) {
                select_options.push({ label: t("settings.embed.auto_role"), value: "auto_role"+interaction.user.id, emoji: "🎯"})
            }

            if (guild?.voice_panel?.active?.member) {
                select_options.push({ label: t("settings.embed.voice_panel"), value: "voice"+interaction.user.id, emoji: "🔉"})
            }

            if (guild?.greet?.isActive) {
                select_options.push({ label: t("help.command.greet").replaceAll("/", ""), value: "greet"+interaction.user.id, emoji: "👌"})
            }

            if (guild?.twitch?.isActive) {
                select_options.push({ label: t("help.command.twitch").replaceAll("/", ""), value: "twitch"+interaction.user.id, emoji: "🔔" })
            }

            if (guild?.public_register?.isActive) {
                select_options.push({ label: t("help.command.public_register").replaceAll("/", ""), value: "public"+interaction.user.id, emoji: "📌" })
            }

            if (guild?.special_room?.isActive) {
                select_options.push({ label: t("help.command.special_room").replaceAll("/", ""), value: "special"+interaction.user.id, emoji: "🧐" })
            }

            if (guild?.youtube_alert?.isActive) {
                select_options.push({ label: t("help.command.youtube_alert").replace("/", ""), value: "youtube"+interaction.user.id, emoji: "🔔" })
            }
    
            const select_menu = new ActionRowBuilder()
            .setComponents(
                new StringSelectMenuBuilder()
                .setCustomId("help_select_menu")
                .setPlaceholder("⚙️")
                .addOptions(select_options)
                .setDisabled(false)
            )

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_premium"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_premium"+interaction.user.id)
        .setDisabled(false),
    )

    if (!select_options.length) {
        interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })
    } else {
        interaction.update({ embeds: [help_embed], components: [select_menu, (user?.premium_active ? not_button : help_button)] })
    }

}

if (choice == "special"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"🧐 " + t("help.command.special_room").replaceAll("/", "")}: ${guild?.special_room?.isActive ? on : close}`, value: `**${"📌 " + t("help.command_information.voice.channel")}:** <#${guild?.special_room?.channel}>`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "public"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"📌 " + t("help.command.public_register").replaceAll("/", "")}: ${guild?.public_register?.isActive ? on : close}`, value: `**${"🔗 " + t("help.command_information.twitch.channel")}:** <#${guild?.public_register?.u_channel}> \n **${"🧑 " + t("help.command_information.public.man")}:** <@&${guild?.public_register?.m_role}> \n **${"👩 " + t("help.command_information.public.girl")}:** <@&${guild?.public_register?.g_role}> \n **${"👤 " + t("help.command_information.public.u")}:** <@&${guild?.public_register?.u_role}> \n **${"🛡 " + t("help.command_information.public.y")}:** <@&${guild?.public_register?.a_role}>`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "youtube"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"👤 " + t("help.command_information.twitch.channel_tag")}`, value: `\`\`\`${guild?.youtube_alert?.channel_id}\`\`\``, inline: true },
        { name: `${"🔔 " + t("help.command.youtube_alert").replace("/", "")}: ${guild?.twitch?.isActive ? on : close}`, value: `**${"📌 " + t("help.command_information.twitch.channel")}:** <#${guild?.youtube_alert?.channel}> \n **${"✨ " + t("help.command_information.twitch.tag")}:** <@&${guild?.youtube_alert?.role}>`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "twitch"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"👤 " + t("help.command_information.twitch.channel_tag")}`, value: `\`\`\`${guild?.twitch?.username}\`\`\``, inline: true },
        { name: `${"🔔 " + t("help.command.twitch").replaceAll("/", "")}: ${guild?.twitch?.isActive ? on : close}`, value: `**${"📌 " + t("help.command_information.twitch.channel")}:** <#${guild?.twitch?.alert_channel}> \n **${"✨ " + t("help.command_information.twitch.tag")}:** <@&${guild?.twitch?.role}>`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "greet"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"👌 " + t("help.command.greet").replaceAll("/", "")}: ${guild?.greet?.isActive ? on : close}`, value: `**${"📌 " + t("help.command_information.voice.channels")}:** ${guild?.greet?.channels.map(channel => `<#${channel}>`)}`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "voice"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"🔉 " + t("help.command_information.voice.total_member")}: ${guild?.voice_panel?.active?.member ? on : close}`, value: `**${"📌 " + t("help.command_information.voice.channel")}:** <#${guild?.voice_panel?.channel?.member}>`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "auto_role"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"🎯 " + t("settings.embed.auto_role")}: ${guild?.auto_role?.isActive ? on : close}`, value: `**${"📌 " + t("help.command_information.auto_role.role")}:** ${guild?.auto_role?.roles.map(role => `<@&${role}>`)}`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "level"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: "✨ " + t("help.command_information.level.message"), value: `\`\`\`${guild?.level_system?.level_message}\`\`\``, inline: true },
        { name: `${"💭 " + t("help.command_information.level.message_t")}: ${guild?.level_system?.tActive ? on : close}`, value: `**${"📌 " + t("help.command_information.level.message_e")}:** ${guild?.level_system?.eActive ? on : close} \n **${"📌 " + t("help.command_information.level.channel")}: <#${guild?.level_system?.channel}>**`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "member_count"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"👥 " + t("settings.embed.member_count")}: ${guild?.member_count?.isActive ? on : close}`, value: `**${"🧷 " + t("help.command_information.member_count.target")}: ${guild?.member_count?.count}**`, inline: true }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "ticket"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"🎫 " + t("settings.embed.ticket")}: ${guild?.ticket?.isActive ? on : close}`, value: `**${"🧢 " + t("help.command_information.ticket.channel")}: <#${guild?.ticket?.ticket_category}>** \n **${"📒 " + t("help.command_information.ticket.mod")}: <@&${guild?.ticket?.ticket_moderator}>** \n **${"🔗 " + t("help.command_information.ticket.ticket_count")}: ${guild?.ticket?.max_ticket_count}**`, inline: true }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "url"+interaction.user.id) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: `${"🦴 " + t("settings.embed.vanity_url")}: ${(guild?.vanityURLProtection?.isActive ? on : close)}`, value: `**${"🧢 " + t("help.command_information.vanity.channel")}: <#${guild?.vanityURLProtection?.channel}>**`, inline: true }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

if (choice == "welcome"+interaction.user.id) {
    
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const perm = "Administrator"
        return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
    }
    
    const user = await User.findOne({ user_id: interaction.user.id })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    const on = "<:on:1121786054656151742>"
    const close ="<:off:1121786160054800485>"

    const options = [
        { name: "👋 " + t("help.command_information.welcome.welcome_hello"), value: `\`\`\`${guild?.welcome?.welcome_message}\`\`\``, inline: true },
        { name: "👋 " + t("help.command_information.welcome.welcome_bye"), value: `\`\`\`${guild?.welcome?.welcome_message}\`\`\``, inline: true },
        { name: `${"💭 " + t("help.command_information.welcome.welcome_t")}: ${guild?.welcome?.tActive ? on : close}`, value: `**${"📌 " + t("help.command_information.welcome.welcome_e")}: ${guild?.welcome?.eActive ? on : close}** \n **${"🖼️ " + t("help.command_information.welcome.welcome_p")}: ${guild?.welcome?.pActive ? on : close}**`, inline: false }
    ]

    const help_embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor(process.env.MAIN_COLOR)
    .addFields(options)

    const help_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0} / 250`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:diamond:1126047166750801932>")
        .setLabel("Premium")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
        .setDisabled(false),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    const not_button = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
        .setEmoji("<:coin:1126122797425508352>")
        .setLabel(`${user?.money?.money || 0}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId("null")
        .setDisabled(true),
        new ButtonBuilder()
        .setEmoji("<:carpi:1119645460265717949>")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("return_system"+interaction.user.id)
        .setDisabled(false),
    )

    interaction.update({ embeds: [help_embed], components: [(user?.premium_active ? not_button : help_button)] })

}

}

    if (interaction.customId == "return_premium"+interaction.user.id) {

        const user = await User.findOne({ user_id: interaction.user.id })

        const client_users = interaction.client.guilds.cache.reduce((a,b)=> a + b.memberCount, 0)
        const guild_count = interaction.client.guilds.cache.size
        const bot_name = interaction.client.user.username
        const processs = process.env.BOT_VERSION

        const field_options = [
            { name: "<:baret:1119645430393876570> " + t("help.service.name"), value: t("help.service.description", { bot_name, processs }), inline: false },
            { name: "<:icon_discord:1119645834091446403> " + t("help.uptime.name"), value: t("help.uptime.description", { client_users, guild_count, bot_name }), inline: false }
        ]

        const select_options = [
            { label: t("help.select_menu.all_command"), value: "all_command"+interaction.user.id, emoji: "<:star:1126046723983282276>" },
            { label: "Premium", value: "premium"+interaction.user.id, emoji: "<:icon_newmember:1119698836978421910>" }
        ]

        const help_embed = new EmbedBuilder()
        .setColor(process.env.MAIN_COLOR)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setImage("https://media.discordapp.net/attachments/1108103607045337148/1131693564322119681/standard.gif")
        .addFields(field_options)
        .setTimestamp()
        .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })

        const select_menu = new ActionRowBuilder()
        .setComponents(
            new StringSelectMenuBuilder()
            .setCustomId("help_select_menu")
            .setPlaceholder("👆🏻")
            .addOptions(select_options)
            .setDisabled(false)
        )

        const help_button = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
            .setEmoji("<:coin:1126122797425508352>")
            .setLabel(`${user?.money?.money || 0} / 250`)
            .setStyle(ButtonStyle.Primary)
            .setCustomId("null")
            .setDisabled(true),
            new ButtonBuilder()
            .setEmoji("<:diamond:1126047166750801932>")
            .setLabel("Premium")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("get_premium:" + interaction.user.id + "?" + user?.money?.money)
            .setDisabled(false),
            new ButtonBuilder()
            .setEmoji("<:carpi:1119645460265717949>")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("return_premium"+interaction.user.id)
            .setDisabled(false),
        )
    
        const not_button = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
            .setEmoji("<:coin:1126122797425508352>")
            .setLabel(`${user?.money?.money || 0}`)
            .setStyle(ButtonStyle.Primary)
            .setCustomId("null")
            .setDisabled(true),
            new ButtonBuilder()
            .setEmoji("<:carpi:1119645460265717949>")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("return_premium"+interaction.user.id)
            .setDisabled(false),
        )
    
        interaction.update({ embeds: [help_embed], components: [select_menu, (user?.premium_active ? not_button : help_button)] })

    }

}