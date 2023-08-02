import Guild from "../database/schema/guild.js"
import Parser from "rss-parser"

export const youtube_alert = async (client) => {

    setInterval(async () => {

    const guilds = await Guild.find()

    guilds.forEach(async (guild) => {

        if (!guild?.youtube_alert?.isActive) return

        const parser = new Parser()
        const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${guild?.youtube_alert?.channel_id}`).catch(() => { })

        if (!feed || !feed.items || feed.items.length === 0) return

        if (feed?.items[0]?.id == guild?.youtube_alert?.old_video) return

        client.channels.cache.get(guild?.youtube_alert?.channel).send(`${feed?.items[0]?.link} ${`<@&${guild?.youtube_alert?.role}>` || "@everyone"}`).then(async () => {
            await Guild.updateOne({ guild_id: guild?.guild_id }, { $set: { "youtube_alert.old_video": feed?.items[0]?.id } }, { upsert: true })
        })

    })
}, 10000)

}