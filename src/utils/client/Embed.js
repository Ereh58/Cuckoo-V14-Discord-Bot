import { Colors, EmbedBuilder } from "discord.js"

export const errorEmbed = (input) => {
    const embed = new EmbedBuilder()
    .setDescription("<:red_cuckoo:1128046782606221405> "+input)
    .setColor(Colors.Red)
    return { embeds: [embed], ephemeral: true }
}

export const successEmbed = (input) => {
    const embed = new EmbedBuilder()
    .setDescription("<:blue_cuckoo:1128047011984314388> "+input)
    .setColor(Colors.Green) 
    return { embeds: [embed], ephemeral: true }
}

export const normalEmbed = (input, color) => {
    const embed = new EmbedBuilder()
    .setDescription(input)
    .setColor(color || Colors.DarkButNotBlack)
    return { embeds: [embed], ephemeral: true }
}