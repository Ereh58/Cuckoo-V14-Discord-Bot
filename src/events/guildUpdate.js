import vanityURLProtectionControl from "../utils/commands/vanityURLProtection/control.js"

/**
 * @param {import("discord.js").Client} client
 */
export default async (client) => {

    client.on("guildUpdate", async (newGuild, oldGuild) => {
        vanityURLProtectionControl(oldGuild, newGuild)
    })

}