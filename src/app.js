import { Client, GatewayIntentBits, Collection, Colors } from "discord.js"
import { readdir, readdirSync } from "fs"
import { createRequire } from "module"
import { input } from "../src/utils/client/Guild.js"
import guild_db from "./utils/database/schema/guild.js"
import user_db from "./utils/database/schema/user.js"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import mongoose from "mongoose"
import * as database from "./utils/database/mongoose.js"
import * as embedMenu from "./utils/client/Embed.js"
import "dotenv/config"

const require = createRequire(import.meta.url)
const emojis = require("../src/emojis.json")

// Client instance
const client = new Client({
    intents: [
        [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences]
    ]
})

// Guilds Stats
client.on("guildCreate", (guild) => input(guild))

// Assignments
client.commands = new Collection()
client.color = Colors
client.database = database
client.guild_db = guild_db
client.user_db = user_db
client.e = embedMenu
client.emoji = emoji_name => emoji_name in emojis ? emojis[emoji_name] : "🎉"

// Database connection
await mongoose.connect(process.env.MONGO)

// i18next instance
await i18next
.use(Backend)
.init({
    fallbackLng: "en-US",
    preload: readdirSync("./locales"),
    ns: readdirSync("./locales/en-US").map(file => file.replace(".json", "")),
    defaultNS: "commands",
    backend: {
        loadPath: "./locales/{{lng}}/{{ns}}.json"
    }
})

// Event Loader
readdir("./events", { encoding: "utf-8" }, (err, files) => {
    if (err) return console.error(err)

    files.filter(file => file.endsWith(".js")).forEach(file => {
        import(`./events/${file}`).then(e => e.default(client))
    })
})

// Command Loader
readdir("./commands", { encoding: "utf-8" }, (err, folders) => {
    if (err) return console.error(err)

    folders.forEach(folder => {
        readdir(`./commands/${folder}`, { encoding: "utf-8" }, (err, files) => {
            if (err) return console.error(err)

            files.filter(file => file.endsWith(".js")).forEach(file => {

                import(`./commands/${folder}/${file}`).then(c => {
                    client.commands.set(c.data.name, c.data)
                })

            })
        })
    })
})

process.on("unhandledRejection", e => {
    if (e.code > 10000) return

    console.log(e)
})

client.login(process.env.TOKEN)