import { successEmbed, errorEmbed } from "../../client/Embed.js"
import { PermissionFlagsBits } from "discord.js"
import { t } from "i18next"

export const message_delete = async (message) => {

    try {

    if (message.content.toLowerCase().startsWith(process.env.PREFIX + "sil")) {

        const perm = "Mesajları Yönet"

        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply(errorEmbed(t("user_permissions", { ns: "common", perm, lng: "tr" })))

        const count = parseInt(message.content.split(' ')[1])
        if (!count) return message.reply(errorEmbed(t("delete_message.not_count", { lng: message.locale })))
        if (count >= 100) return message.reply(errorEmbed(t("delete_message.not_100_count", { lng: message.locale })))

        if (!isNaN(count)) message.channel.bulkDelete(count + 1).catch(() => { }).then(() => message.channel.send(successEmbed(t("delete_message.done", { lng: "tr", count }))))
    }

    if (message.content.toLowerCase().startsWith(process.env.PREFIX + "delete")) {

        const perm = "Mesajları Yönet"

        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply(errorEmbed(t("user_permissions", { ns: "common", perm, lng: "en-US" }).replace("`", "")))

        const count = parseInt(message.content.split(' ')[1])
        if (!count) return message.reply(errorEmbed(t("delete_message.not_count", { lng: message.locale })))
        if (count >= 100) return message.reply(errorEmbed(t("delete_message.not_100_count", { lng: message.locale })))

        if (!isNaN(count)) message.channel.bulkDelete(count + 1).catch(() => { }).then(() => message.channel.send(successEmbed(t("delete_message.done", { lng: "en-US", count }))))
    }

} catch {
    return
}

}