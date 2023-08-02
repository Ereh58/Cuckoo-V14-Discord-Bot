import { successEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"

export const man_modal = async (interaction) => {

    try {

    const guild_db = await Guild.findOne({ guild_id: interaction.guild.id })

    const member = interaction.guild.members.cache.get(interaction.customId.split("?")[1])

    const user = interaction.customId.split("?")[1]

    await interaction.deferReply({ ephemeral: true })

    if (member.roles.cache.has(guild_db?.public_register?.u_role)) await member.roles.remove(guild_db?.public_register?.u_role)

    await member.roles.add(guild_db?.public_register?.m_role).then(() => interaction.editReply(successEmbed(t("public_register.reply.register_done", { user })))).then(() => member.setNickname(`${interaction.fields.getTextInputValue("name")} ${interaction.fields.getTextInputValue("age")}`))

    interaction.message.delete()

    } catch {
        return
    }

}

export const girl_modal = async (interaction) => {

    try {

    const guild_db = await Guild.findOne({ guild_id: interaction.guild.id })

    const member = interaction.guild.members.cache.get(interaction.customId.split("?")[1])

    const user = interaction.customId.split("?")[1]

    await interaction.deferReply({ ephemeral: true })

    if (member.roles.cache.has(guild_db?.public_register?.u_role)) await member.roles.remove(guild_db?.public_register?.u_role)

    await member.roles.add(guild_db?.public_register?.g_role).then(() => interaction.editReply(successEmbed(t("public_register.reply.register_done", { user })))).then(() => member.setNickname(`${interaction.fields.getTextInputValue("name")} ${interaction.fields.getTextInputValue("age")}`))

    interaction.message.delete()

    } catch {
        return
    }

}