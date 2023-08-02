import User from "../../database/schema/user.js"

export const prize_control = async (client) => {

    setInterval(async () => {

    const users = await User.find()

    users.forEach(async (user) => {

        if (user?.prize_time < Date.now()) {
            await User.updateOne({ user_id: user?.user_id }, { $set: { "prize_active": false } }, { upsert: true })
        }

    })

}, 10000)

}