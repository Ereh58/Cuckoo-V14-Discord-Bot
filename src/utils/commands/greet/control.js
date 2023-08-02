import Guild from "../../database/schema/guild.js"

export const greet_control = async (member) => {

    const guild = await Guild.findOne({ guild_id: member.guild.id })

    if (!guild) return
    if (!guild?.greet?.isActive) return

    guild?.greet?.channels.forEach(async (channel) => {
        const ch = member.client.channels.cache.get(channel)

        await ch.send(`<@${member.user.id}>`).then((msg) => {
            setTimeout(async () => {
                if (msg) {
                    await msg.delete()
                }
            }, 100)
        })
    })

}