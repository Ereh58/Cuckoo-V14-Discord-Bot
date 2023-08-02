import { EmbedBuilder, Colors } from "discord.js"

export const input = async (guild) => {

    const owner = guild.client.users.cache.get(guild.ownerId)

        const options = [
        { name: "👀 Guild Name:", value: `${guild.name}`, inline: true },
        { name: "🧠 Guild Owner:", value: `[${owner.username}](https://discord/users/${guild.ownerId})`, inline: true },
        { name: "⏰ Added Time:", value: `<t:${parseInt((guild.joinedTimestamp) / 1000)}> (<t:${parseInt((guild.joinedTimestamp) / 1000)}:R>)`, inline: true }
    ]
    
    const channel = guild.client.channels.cache.get(process.env.INPUT_OUTPUT_CHANNEL)
    const embed = new EmbedBuilder()
    .setTitle("<:baret:1119645430393876570> Added to New Server")
    .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL()
    })
    .setColor(Colors.Green)
    .addFields(options)
    .setFooter({ text: `👥 Number of Server Members: ${guild.memberCount}` })
    .setThumbnail(guild.iconURL())

    await channel.send({ embeds: [embed] })

}