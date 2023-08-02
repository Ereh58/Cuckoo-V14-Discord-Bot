import Guild from "../../database/schema/guild.js"

export const voice_panel = async (client) => {

setInterval(() => {
    try {
    client.guilds.cache.forEach(async (guild) => {
        const guilds = await Guild.findOne({ guild_id: guild.id })

        if (!guilds) return
        if (!guilds?.voice_panel?.active?.member) return

        const total_member = guild.channels.cache.get(guilds?.voice_panel?.channel?.member)

        if (total_member.name == total_member.name.split(":")[0] + `: ${guild.memberCount}`) return
        else {
            await total_member.setName(total_member.name.split(":")[0] + `: ${guild.memberCount}`).catch(() => { })
        }
        
    })
} catch {
    return
}
}, 10000)

}