import { PermissionFlagsBits } from "discord.js"
import { errorEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"

export const advertising_block = async (message) => {
    try {
        const guild = await Guild.findOne({ guild_id: message.guildId })
        const advertising = ["discord.app", "discord.gg", "invite","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az"]

        if (guild) {
            if (!guild?.advertising_block?.isActive) return
            if (message?.member?.permissions?.has(PermissionFlagsBits.Administrator)) return

            if (advertising.some(w => message.content.toLowerCase().includes(w))) {
                await message.delete()
                .then(() => {
                    message.channel.send(errorEmbed(t("advertising_block.block_message", { lng: message.guild.preferredLocale }).replace("{user}", `<@${message.author.id}>`)))
                    .then(async (msg) => {
                            setTimeout(() => {
                                if (msg) {
                                msg.delete().catch(() => { })
                                }
                            }, 7000)
                    })
                    .catch(() => {
                        return
                    })
                })
            }
        }
    } catch {
        return
    }
}

export const advertising_block_update = async (newMessage) => {
    try {
        const guild = await Guild.findOne({ guild_id: newMessage.guildId })
        const advertising = ["discord.app", "discord.gg", "invite","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az"]

        if (guild) {
            if (!guild?.advertising_block?.isActive) return
            if (newMessage?.member?.permissions?.has(PermissionFlagsBits.Administrator)) return

            if (advertising.some(w => newMessage.content.toLowerCase().includes(w))) {
                await newMessage.delete()
                .then(() => {
                    newMessage.channel.send(errorEmbed(t("advertising_block.block_message", { lng: newMessage.guild.preferredLocale }).replace("{user}", `<@${newMessage.author.id}>`)))
                    .then(async (msg) => {
                            setTimeout(() => {
                                if (msg) {
                                msg.delete().catch(() => { })
                                }
                            }, 7000)
                    })
                    .catch(() => {
                        return
                    })
                })
            }
        }
    } catch {
        return
    }
}