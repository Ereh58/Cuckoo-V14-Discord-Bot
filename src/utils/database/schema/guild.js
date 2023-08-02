import mongoose from "mongoose"

export default mongoose.model("guilds", new mongoose.Schema({
    guild_id: { type: String, required: true },
    vanityURLProtection: { isActive: { type: Boolean, default: false }, channel: { type: String } },
    welcome: { tActive: { type: Boolean, default: false }, eActive: { type: Boolean, default: false }, pActive: { type: Boolean, default: false }, welcome_message: { type: String }, bye_message: { type: String }, channel: { type: String }, picture: { type: String }},
    advertising_block: { isActive: { type: Boolean, default: false }},
    ticket: { isActive: { type: Boolean, default: false }, ticket_category: String, ticket_moderator: String, max_ticket_count: Number, tickets: [{ ticket_id: String }] },
    member_count: { isActive: { type: Boolean, default: false }, count: Number },
    level_system: { tActive: { type: Boolean, default: false }, eActive: { type: Boolean, default: false }, user_id: [{ user_id: { type: String, required: true }, level: { type: Number, default: 0 }, xp: { type: Number, default: 0 }}], channel: String, level_message: String, picture: String, roleSelect: [{ role_id: { type: String }, level: { type: Number } }] },
    auto_role: { isActive: { type: Boolean, default: false }, roles: { type: Array, default: [] }},
    voice_panel: { active: { member: { type: Boolean, default: false } }, channel: { member: String } },
    greet: { isActive: { type: Boolean, default: false }, channels: { type: Array, default: [] }},
    twitch: { isActive: { type: Boolean, default: false }, alert_channel: String, username: String, old_stream: { type: Boolean, default: false }, role: String },
    public_register: { isActive: { type: Boolean, default: false }, u_channel: String, a_role: String, u_role: String, m_role: String, g_role: String },
    special_room: { isActive: { type: Boolean, default: false }, channel: String },
    youtube_alert: { isActive: { type: Boolean, default: false }, channel_id: String, channel: String, old_video: String, role: String },
    reaction_role: { isActive: { type: Boolean, default: false } },
    ban_members: [{ user: String, reason: { type: String, default: "not reason" }}],
    lng: { type: String, default: "en-US" }
}))