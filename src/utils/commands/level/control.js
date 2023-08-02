import { EmbedBuilder } from "discord.js"
import { errorEmbed, successEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"

export default async (message) => {
    const guildData = await Guild.findOne({ guild_id: message.guildId })

    if (!guildData?.level_system?.tActive && !guildData?.level_system?.eActive) return

    const channel = message.client.channels.cache.get(guildData?.level_system?.channel)

    const user = guildData?.level_system?.user_id?.find(u => u.user_id === message.author.id)
    if (message.author.bot) return

    if (!user) {
        await Guild.updateOne({ guild_id: message.guildId }, { $push: { "level_system.user_id": { user_id: message.author.id, level: 0, xp: 0 } } }, { upsert: true })
    } else {
        const nextLevelXP = (user.level + 1) * 10 || Number.MAX_SAFE_INTEGER

        await Guild.updateOne({ guild_id: message.guildId, "level_system.user_id.user_id": message.author.id }, { $inc: { "level_system.user_id.$.xp": 1 } })

        user.xp++
        if (user.xp >= nextLevelXP) {
            user.xp -= nextLevelXP
            user.level++

            await Guild.updateOne({ guild_id: message.guildId, "level_system.user_id.user_id": message.author.id }, { $set: { "level_system.user_id.$.level": user.level, "level_system.user_id.$.xp": user.xp } }).then(async () => {

                const currentRole = guildData?.level_system?.roleSelect?.find(role => role.level === user.level - 1)?.role_id;
                const newRole = guildData?.level_system?.roleSelect?.find(role => role.level === user.level)?.role_id;
    
                if (currentRole) {
                    const roleToRemove = message.guild.roles.cache.get(currentRole);
                    if (roleToRemove) {
                        await message.member.roles.remove(roleToRemove).catch(() => { });
                    }
                }
    
                if (newRole) {
                    const roleToAdd = message.guild.roles.cache.get(newRole);
                    if (roleToAdd) {
                        await message.member.roles.add(roleToAdd).catch(() => { });
                    }
                }

                const t = guildData?.level_system?.tActive || false
                const e = guildData?.level_system?.eActive || false
                //const p = guildData?.level_system?.pActive || false

                if (t) {
                    channel.send((guildData?.level_system?.level_message || "{user} Update level {level}")?.replaceAll("{user}", `<@${message.author.id}>`).replaceAll("{level}", user.level).replaceAll("{xp}", user.xp))
                }

                if (e) {
                    const Embed = new EmbedBuilder()
                    .setDescription((guildData?.level_system?.level_message || "{user} Update level {level}")?.replaceAll("{user}", `<@${message.author.id}>`).replaceAll("{level}", user.level).replaceAll("{xp}", user.xp))
                    .setColor(process.env.MAIN_COLOR)
                    .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })

                    channel.send({ embeds: [Embed] })
                }

            })
        }
    }
}

export const role_modals = async (interaction) => {

    await interaction.deferReply({ ephemeral: true })

    const level = interaction.fields.getTextInputValue("level")
    const role = interaction.fields.getTextInputValue("role")

    if (level > 1000) return interaction.editReply(errorEmbed(t("level_system.not_1000_length", { lng: interaction.locale })))

    const roles = interaction.guild.roles.cache.get(role)

    if (!roles) return interaction.editReply(errorEmbed(t("level_system.not_role", { lng: interaction.locale })))

    await Guild.updateOne({ guild_id: interaction.guild.id }, { $push: { "level_system.roleSelect": { role_id: role, level: level } } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("level_system.done_role", { lng: interaction.locale }))))
    
}