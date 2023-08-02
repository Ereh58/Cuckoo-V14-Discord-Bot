import { ChannelType, PermissionFlagsBits } from "discord.js"

const map = new Map()

/**
 * @param {import("discord.js").Client} client
 */
export default async (client) => {

    client.on("voiceStateUpdate", async (oldVoice, newVoice) => {

        const { database } = newVoice.client

        const guild = await database.fetchGuild(newVoice.guild.id)

        if (!guild) return
        if (!guild?.special_room?.isActive) return

        if (newVoice.channelId == guild?.special_room?.channel) {

            try {

            newVoice.channel.guild.channels.create({
                name: newVoice.member.user.username,
                type: ChannelType.GuildVoice,
                parent: newVoice.channel.parentId,
                permissionOverwrites: [ { id: newVoice.member.id, allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] }, { id: newVoice.guild.roles.everyone.id, allow: [PermissionFlagsBits.Connect] } ]
            }).then(async (channel) => {

                setTimeout(() => {
                    map.set(channel.id, channel.id) 
                }, 2000)

                await channel.setName(newVoice.member.user.username)

                if (newVoice.channelId !== channel.id) {
                    await newVoice.setChannel(channel)
                }
            })

        } catch {
            return
        }

        }
    })

    setInterval(() => {
        map.forEach(async (data) => {

            const channel = client.channels.cache.get(data)
    
            if (!channel) return

            else if (!channel.members.size) {
                await channel.delete().then(() => map.delete(data))
            }

        })
    }, 2000)
}