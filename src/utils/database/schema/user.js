import mongoose from "mongoose"

export default mongoose.model("users", new mongoose.Schema({
    user_id: { type: String, required: true },
    premium_active: { type: Boolean, default: false },
    bug_hunter: { type: Boolean, default: false },
    support_team: { type: Boolean, default: false },
    sponsor: { type: Boolean, default: false },
    money: { money: { type: Number, default: 0 }, isActive: { type: Boolean, default: false } },
    prize_time: { type: String },
    prize_active: { type: Boolean, default: false },
    time: { type: String },
    infiniti_premium: { type: Boolean, default: false }
}))