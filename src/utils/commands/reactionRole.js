import { Colors } from "discord.js"
import { successEmbed } from "../client/Embed.js"
import { t } from "i18next"

export const select_menu = async (interaction) => {

    if (interaction.customId == "/reaction/+/select/") {

        const role = interaction.values

        await interaction.deferReply({ ephemeral: true })

        const add_roles = role.filter(role_id => !interaction.member.roles.cache.has(role_id))
        const remove_roles = interaction.message.components[0].components[0].options.filter(option => !role.includes(option.value) && interaction.member.roles.cache.has(option.value)).map(option => option.value)

        if (add_roles.length) await interaction.member.roles.add(add_roles).catch(() => { })
        if (remove_roles.length) await interaction.member.roles.remove(remove_roles).catch(() => { })

        const remove_role = remove_roles.map(id => `<@&${id}>`).join(", ")
        const add_role = add_roles.map(id => `<@&${id}>`).join(", ")

        var text = `
        ${add_roles.length ? (add_roles.length > 1 ? t("reaction_role.add_s", { add_role, lng: interaction.locale }) : t("reaction_role.add_not_s", { add_role, lng: interaction.locale })) : ""}
        ${remove_roles.length ? (remove_roles.length > 1 ? t("reaction_role.remove_s", { remove_role, lng: interaction.locale }) :  t("reaction_role.remove_not_s", { remove_role, lng: interaction.locale })) : ""}
        `

        interaction.editReply({ embeds: [{ description: text, color: Colors.Green }] })
        
    }

}

export const button = async (interaction) => {

    if (!interaction.customId.startsWith("/reaction/+/button/")) return

    const role_id = interaction.customId.split("button/")[1]

    const role = interaction.guild.roles.cache.get(role_id)

    await interaction.deferReply({ ephemeral: true })

    if (interaction.member.roles.cache.has(role_id)) {
        interaction.member.roles.remove(role_id).then(() => {
            interaction.editReply(interaction.client.e.normalEmbed(t("reaction_role.button_remove", { role_id }), role.color))
        })
    } else {
        interaction.member.roles.add(role_id).then(() => {
            interaction.editReply(interaction.client.e.normalEmbed(t("reaction_role.button_add", { role_id }), role.color))
        })
    }

}