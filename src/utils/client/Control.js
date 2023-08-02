import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"
import User from "../../utils/database/schema/user.js"

export const database_control = async (client) => {

    setInterval(async () => {
        try {

        const guilds = await Guild.find()

        guilds.forEach(async (guild) => {

            if (!guild?.welcome?.picture?.endsWith(".jpg")) await Guild.updateOne({ guild_id: guild?.guild_id }, { $set: { "welcome.picture": "https://cdn.discordapp.com/attachments/1113899859259433120/1117434206579073054/image0.jpg" } }, { upsert: true })

            if (guild?.welcome?.pActive) await Guild.updateOne({ guild_id: guild?.guild_id }, { $set: { "member_count.isActive": false, "member_count.count": 0 } }, { upsert: true })
            if (guild?.welcome?.tActive) await Guild.updateOne({ guild_id: guild?.guild_id }, { $set: { "member_count.isActive": false, "member_count.count": 0 } }, { upsert: true })

        })
    } catch {
        return
    }

}, 10000)
}

export const premium_control = async (client) => {

    setInterval(async () => {
        try {

        const guilds = await Guild.find()

        guilds.forEach(async (guild) => {

            const guild_info = client.guilds.cache.get(guild?.guild_id)

            if (!guild_info) return

            const user = await User.findOne({ user_id: guild_info?.ownerId })

            if (!user) return

            if (user?.premium_active) return

            await Guild.updateOne({ guild_id: guild?.guild_id }, { $set: { "welcome.pActive": false, "twitch.isActive": false, "public_register.isActive": false, "youtube_alert.isActive": false } }, { upsert: true })
        })
    } catch {
        return
    }

    }, 10000)


}

export const user_premium = async (client) => {

    setInterval(async () => {

    const users = await User.find()

    users.forEach(async (user) => {

        if (!user) return

        if (user?.infiniti_premium) return

        if (user?.time < Date.now()) {
            await User.updateOne({ user_id: user?.user_id }, { $set: { "infiniti_premium": false, "premium_active": false } }, { upsert: true })
        }

    })

}, 10000)

}

export const guild_premuim = async (client) => {

}