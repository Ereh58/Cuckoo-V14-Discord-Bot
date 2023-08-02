import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { t } from "i18next"
import Guild from "../../database/schema/guild.js"
import fetch from "node-fetch"
import timestamp from "./timestamp.js"

export const twicth_alert = async (client) => {

    setInterval(async () => {

        try {

        const guilds = await Guild.find()

        guilds.forEach(guild => {

        if (!guild) return
        if (!guild?.twitch?.isActive) return

        const channel = client.channels.cache.get(guild?.twitch?.alert_channel || "1120453965503545475")

        const twitchUsername = guild?.twitch?.username || "eray"

        fetch(`https://api.twitch.tv/helix/streams?user_login=${twitchUsername}`, {
          method: "GET",
          headers: { "client-id": process.env.TWITCH_CLIENT_ID, "Authorization": `Bearer ${process.env.TWITCH_TOKEN}` }
      }).then(response => response.json().catch(() => { }).then(async tRes => {

            if (!tRes?.data?.length) return await Guild.updateOne({ guild_id: guild?.guild_id }, { $set: { "twitch.old_stream": false } }, { upsert: true })

            if (guild?.twitch?.old_stream) return

            const widthRandom = 500 + Math.floor(Math.random() * 30)
            const heightRandom = 250 + Math.floor(Math.random() * 30)

            const thumbnail = tRes.data[0].thumbnail_url.replace("{width}", widthRandom).replace("{height}", heightRandom)

                const twicth_embed = new EmbedBuilder()
                .setAuthor({ name: tRes.data[0].title, iconURL: "https://media.discordapp.net/attachments/1108103607045337148/1131248191719882762/twitch.png", url: `https://www.twitch.tv/${twitchUsername}` })
                .setURL(`https://twitch.tv/${tRes.data[0].user_login}`)
                .setColor("#6441a5")
                .addFields(
                    { name: t("twitch.embed.game", { lng: guild?.lng }), value: tRes.data[0].game_name, inline: true },
                    { name: t("twitch.embed.lang", { lng: guild?.lng }), value: tRes.data[0].language, inline: true },
                    { name: t("twitch.embed.date", { lng: guild?.lng }), value: timestamp(tRes.data[0].started_at, "R"), inline: true }
                )
                .setImage(thumbnail)

                const viewer_row = new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder()
                    .setCustomId("viwer_button")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(tRes.data[0].viewer_count.toString())
                    .setDisabled(true)
                )

                channel.send({ content: `${`<@&${guild?.twitch?.role}>` || "@everyone"}`, embeds: [twicth_embed], components: [viewer_row] }).then(async () => await Guild.updateOne({ guild_id: guild.guild_id }, { $set: { "twitch.old_stream": true } }, { upsert: true }))

        }))
    })
} catch {
    return
}

}, 10000)

}