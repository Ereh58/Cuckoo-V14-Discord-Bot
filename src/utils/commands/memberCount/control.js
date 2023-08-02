import { errorEmbed, successEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"

export const command_interaction = async (interaction, status, number) => {

    await interaction.deferReply({ ephemeral: true })

    const guild = await Guild.findOne({ guild_id: interaction.guildId })

    if (status == "enable") {

        if (!guild?.welcome?.tActive && !guild?.welcome?.eActive && !guild?.welcome?.pActive) return interaction.editReply(errorEmbed(t("welcome_member_count.not_welcome_message")))

        if (guild?.welcome?.tActive) return interaction.editReply(errorEmbed(t("welcome_member_count.not_welcome")))
        if (guild?.welcome?.pActive) return interaction.editReply(errorEmbed(t("welcome_member_count.not_welcome")))

        if (!number) return interaction.editReply(errorEmbed(t("welcome_member_count.not_number_options")))

        await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "member_count.isActive": true, "member_count.count": number } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("welcome_member_count.open_system_message"))))

    }

    if (status == "disable") {

        await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "member_count.isActive": false, "member_count.count": 0 } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("welcome_member_count.close_system_message"))))

    }

}