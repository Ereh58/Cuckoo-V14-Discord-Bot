import { errorEmbed } from "../client/Embed.js"
import { EmbedBuilder } from "discord.js"
import { t } from "i18next"

export const wheel_control = async (interaction) => {

    try {

    const choice = interaction.fields.getTextInputValue("choices").replaceAll(" ", "").split(/,+/)

    if (choice.length < 2) return interaction.reply(errorEmbed(t("wheel.2_length")))

    const wheel_embed = new EmbedBuilder()
    .setAuthor({ name: t("wheel.spin"), iconURL: interaction.user.displayAvatarURL() })
    .setDescription(choice.join(" **-** "))
    .setColor("#24e357")
    .setThumbnail("https://s1.gifyu.com/images/1043150003599835218.gif")

    interaction.reply({ embeds: [wheel_embed], fetchReply: true }).then((m) => {
        setTimeout(() => {
            m.delete().catch(() => { })
        }, 5000)

        setTimeout(() => {

            const randomChoice = choice[Math.floor(Math.random() * choice.length)]

            const wheel_send = new EmbedBuilder()
            .setDescription(`${t("wheel.result")} ${randomChoice}`)
            .setColor("#24e357")

            interaction.channel.send({ embeds: [wheel_send] }).then((m2) => {
                setTimeout(() => {
                    m2.delete().catch(() => { })
                }, 30000)
            })
            
        }, 3000)
    })

} catch {
    return
}

}