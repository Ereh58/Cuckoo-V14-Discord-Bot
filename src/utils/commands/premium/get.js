import { errorEmbed, successEmbed } from "../../client/Embed.js"
import { t } from "i18next"
import User from "../../database/schema/user.js"

/**
* 
* @param {import("discord.js").ChatInputCommandInteraction} interaction 
*/
export const get_premium = async (interaction) => {

    if (!interaction.customId.startsWith("get_premium")) return

    const coin = interaction.customId.split("?")[1]
    const user_coin = interaction.customId.split(":")[1]
    const user = user_coin.split("?")[0]

    if (interaction.customId == "get_premium:" + user + "?" + coin) {

        await interaction.deferReply({ ephemeral: true })

        const user_db = await User.findOne({ user_id: interaction.user.id })

        if (user_db?.premium_active) return interaction.editReply(errorEmbed(t("help.have_premium")))
        
        if (interaction.user.id !== user) return interaction.editReply(errorEmbed(t("not_user", { ns: "common" })))

        if (coin < 250) return interaction.editReply(errorEmbed(t("help.not_premium")))

        const coin_reset = coin - 250

        const user_id = interaction.user.id

        await User.updateOne({ user_id: interaction.user.id }, { $set: { "money.money": coin_reset, "premium_active": true, "time": Date.now() + 604800000 } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("help.add_premium", { user_id }))))

    }

}