import Guild from "../../database/schema/guild.js"

export const auto_role = async (member) => {

    try {

    const guild = await Guild.findOne({ guild_id: member.guild.id })

    if (!guild) return
    if (!guild?.auto_role?.isActive) return

    guild?.auto_role?.roles.forEach(role => {
        member.roles.add(role).catch(() => { })
    })

} catch {
    return
}

}