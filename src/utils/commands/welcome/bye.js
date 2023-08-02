import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import { t } from "i18next"
import Canvas from "canvas";
import Guild from "../../database/schema/guild.js"

/**
* 
* @param {import("discord.js").ChatInputCommandInteraction} interaction 
*/
export const tActive = async (member) => {

    const guild = await Guild.findOne({ guild_id: member.guild.id })

    if (!guild) return
        
    if (!guild.welcome.tActive) return
    const channel = member.client.channels.cache.get(guild.welcome.channel)

        try {
        
            if (channel) {
        
                const text = guild.welcome.bye_message.replace("{user}", `<@${member.user.id}>`).replace("{guild}", member.guild.name).replace("{memberCount}", member.guild.memberCount)
                channel.send(text).catch(() => {})
        
            }
        } catch {
            return
        }
}

export const eActive = async (member) => {

    try {
        const guild = await Guild.findOne({ guild_id: member.guild.id })
        if (!guild) return
    
        if (!guild.welcome.eActive) return
        const channel = member.client.channels.cache.get(guild.welcome.channel)
    
        const target_member =  guild?.member_count?.count
        const target = guild?.member_count?.count - member.guild.memberCount
        const member_count = member.guild.memberCount
    
        const text = guild.welcome.bye_message.replace("{user}", `<@${member.user.id}>`).replace("{guild}", member.guild.name).replace("{memberCount}", member.guild.memberCount)
    
        if (guild?.member_count?.isActive) {
    
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`\n \u200b \n ${text} \n \u200b \n`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: t("welcome_member_count.show_text", { target_member, member_count, target, lng: member.guild.preferredLocale }), iconURL: target_member > member_count ? "https://media.discordapp.net/attachments/1119604751554859161/1121089823743148132/icon.png" : "https://media.discordapp.net/attachments/1119604751554859161/1121090837519012062/image1.png" })
    
            channel.send({ embeds: [embed] }).catch(() => {})
    
        } else {
    
        if (channel) {
            
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`\n \u200b \n ${text} \n \u200b \n`)
            .setThumbnail(member.user.displayAvatarURL())
    
            channel.send({ embeds: [embed] }).catch(() => {})
    
        }
    }
    } catch {
        return
    }
}

export const pActive = async (member) => {

    try {
    const guild = await Guild.findOne({ guild_id: member.guild.id })
    if (!guild) return

    if (!guild.welcome.pActive) return
    const channel = member.client.channels.cache.get(guild.welcome.channel)

    if (channel) {

        const text = guild.welcome.bye_message.replace("{user}", member.user.username).replace("{guild}", member.guild.name).replace("{memberCount}", member.guild.memberCount)
        
        const img_path = guild.welcome.picture.endsWith(".jpg") ? guild.welcome.picture : "https://cdn.discordapp.com/attachments/1113899859259433120/1117434206579073054/image0.jpg"
    
        const canvas = Canvas.createCanvas(566, 283);
        const ctx = canvas.getContext('2d');
    
        const background = await Canvas.loadImage(img_path);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#171717";
    
        text.split("{bottom}").forEach((text, i) => {
            ctx.font = '34px Baloo 2'
            ctx.fillStyle = '#f0f0f0';
            ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 195 + i * 40);
        })
    
        ctx.fillStyle = "#f0f0f0";
        ctx.arc(278, 88, 67, 0, Math.PI * 2);
        ctx.fill()
    
        ctx.beginPath();
        ctx.fillStyle = "#f0f0f0";
        ctx.arc(278, 88, 65, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
    
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
        ctx.drawImage(avatar, 213, 23, 130, 130);
    
        const attachment = new AttachmentBuilder(canvas.toBuffer(), 'image0.jpg');
    
        channel.send({ files: [attachment] }).catch(() => {})

    }
} catch {
    return
}
}
