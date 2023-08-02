import { EmbedBuilder, Colors } from "discord.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"

export default async (oldGuild, newGuild) => {

    try {
    const { emoji } = newGuild.client

    if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
        const guild = await Guild.findOne({ guild_id: newGuild.id })
        if (!guild) return

        if (guild.vanityURLProtection) {
            newGuild.fetchAuditLogs({ limit: 1 }).then(async (audit) => {
                const channel = newGuild.client.channels.cache.get(guild.vanityURLProtection.channel)
                const log = audit.entries.first()

                if (channel) {

                    const options = [
                        { name: `${emoji("fixed")} ${t("vanity_url.old_vanity_url", { lng: newGuild.preferredLocale })}`, value: `\`\`\`${oldGuild.vanityURLCode}\`\`\``, inline: true },
                        { name: `${emoji("fixed")} ${t("vanity_url.new_vanity_url", { lng: newGuild.preferredLocale })}`, value: `\`\`\`${newGuild.vanityURLCode}\`\`\``, inline: true }
                    ]
    
                    const Embed = new EmbedBuilder()
                    .setAuthor({ name: t("vanity_url.change_url", { lng: newGuild.preferredLocale }), iconURL: newGuild.iconURL({ dynamic: true }) })
                    .setColor(Colors.Yellow)
                    .addFields(options)
                    .setDescription(`${t("vanity_url.staff_vanity_url", { lng: newGuild.preferredLocale })} ${log.executor || "Unknown"}`)
    
                    channel.send({ embeds: [Embed] }).catch(() => { })
                }

            })
        } else return
    }
} catch {
    return
}

}