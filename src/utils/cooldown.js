const cooldowns = new Map()

export const cooldownCheck = (command, user_id) => {

    if (command.cooldown == false) return false

    if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Map())

    const timestamp = cooldowns.get(command.name)

    const cooldownAmount = (command.cooldown || 3) * 1000
    const now = Date.now()

    if (!timestamp.has(user_id)) {
        timestamp.set(user_id, now)
        setTimeout(() => timestamp.delete(user_id), cooldownAmount)
        return false
    }

    const expirationTime = timestamp.get(user_id) + cooldownAmount
    if (expirationTime >= now) {
        const timeLeft = ((expirationTime - now) / 1000).toFixed(1)
        return timeLeft == parseInt(timeLeft) ? parseInt(timeLeft) : timeLeft
    }
    else return false
}