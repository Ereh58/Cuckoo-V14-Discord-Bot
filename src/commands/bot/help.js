import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from "discord.js"
import { t } from "i18next"
import User from "../../utils/database/schema/user.js"

export const data = {
    name: t("help.name"),
    description: t("help.description"),
    cooldown: 8,
    /**
    * 
    * @param {import("discord.js").ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {

        try {

        const user = await User.findOne({ user_id: interaction.user.id })

        await interaction.deferReply()

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

        const money = (user?.money?.money || 0) + 50

        if (!user?.money?.isActive) {
            await User.updateOne({ user_id: interaction.user.id }, { $set: { "money.isActive": true, "money.money": money } }, { upsert: true }).then(() => {
                interaction.editReply({ embeds: [help_embed], components: [select_menu, ((user?.premium_active || false) ? not_button : help_button)] })
            })
        } else {
            interaction.editReply({ embeds: [help_embed], components: [select_menu, ((user?.premium_active || false) ? not_button : help_button)] })
        }

        } catch {
            return
        }

    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("help.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("help.description", { lng: "tr" })
    }
}