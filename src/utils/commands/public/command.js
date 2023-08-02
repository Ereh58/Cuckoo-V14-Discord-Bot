import { errorEmbed, successEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"
import User from "../../database/schema/user.js"

export const command_control = async (status, uChannel, mRole, gRole, uRole, aRole, interaction) => {

    const user = await User.findOne({ user_id: interaction.user.id })

    await interaction.deferReply({ ephemeral: true })

    if (!user?.premium_active) return interaction.editReply(errorEmbed(t("not_premium", { ns: "common" })))

    if (status == "enable") {

        if (!uChannel) return interaction.editReply(errorEmbed(t("public_register.not_uChannel")))
        if (!mRole) return interaction.editReply(errorEmbed(t("public_register.not_m_role")))
        if (!gRole) return interaction.editReply(errorEmbed(t("public_register.not_g_role")))
        if (!uRole) return interaction.editReply(errorEmbed(t("public_register.not_u_role")))
        if (!aRole) return interaction.editReply(errorEmbed(t("public_register.not_a_role")))

        const channels = uChannel

        await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "public_register.isActive": true, "public_register.u_channel": uChannel, "public_register.a_role": aRole, "public_register.u_role": uRole, "public_register.m_role": mRole, "public_register.g_role": gRole, "lng": interaction.guild.preferredLocale } }, { upsert: true })
        .then(() => interaction.editReply(successEmbed(t("public_register.done_system", { channels }))))

    }

    if (status == "disable") {

        await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "public_register.isActive": false, "public_register.u_channel": "null", "public_register.a_role": "null", "public_register.u_role": "null", "public_register.m_role": "null", "public_register.g_role": "null" } }, { upsert: true })
        .then(() => interaction.editReply(successEmbed(t("public_register.close_system"))))

    }

}